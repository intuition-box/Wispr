"use client";

import { useEffect, useState } from "react";
import { gqlFetch } from "@/lib/graphql";
import { getContextsByTermId } from "@/lib/termIds";

// On-chain term IDs from packages/ontology/src/seed/deployed.json
// Only components (not types/contexts/predicates)
const COMPONENT_IDS = [
  // w4-p3 components
  "0x276125410411831ca9eaa3059e3475a1efc89151bec1a884ec4d09f23f532dfc", // mcp-notion
  "0xd9690cd4111ea297370dc554244045be346ae4d8330709021d1fd8297298460b", // mcp-twitter
  "0xd6684172d40fc40377a39d8886a6b69d0124af63416a206482c80767826447cb", // claude-sonnet-4-5
  "0x013916205816cc5db7c526ab75a5a9bb44b9ca1d6302d78063172062d7325e86", // chainlink-data-feeds
  "0x581e86cc8b1805fc9bef8144041920991e55721743a736a501372bf171a58455", // 1inch-fusion-plus-sdk
  "0xb93e28e3547650e9f6fa0aa2ef71ab641cf3e17e16d6ad495ae25fe3482668bb", // privy-embedded-wallet
  "0x5f58b7f8e8b98f79447cc035abf7d929c259cb2384f3cb572ff25799fd023e9f", // brand-voice-skill
  // w2-w3 components
  "0xadf544737f548d9b057b58606016b27e3be99a54cf55128083afe78fc1a85bad", // mcp-github
  "0x41b502aee5d54674b49fba27579c0d00eb1bb178f97a860c400c43d04472f92c", // code-review-skill
  "0x8c440d5017a0bb5978388059398c39f73698ba4a93811b293e2a84f3fbd96dd3", // firecrawl-mcp
  "0x0ec84d948f958f451b66f392f40ed5d6455fc1554c6853ba5bac1441e10f825d", // embeddings-matching-skill
  "0x3bf263939c8d136589ea84a24c6a00bfcf3f15cfce1c2ae795d698b45fc97b37", // mcp-gmail
  "0x35cb11f4a04de74c479b39448d1ab6e97dc74d71d20a1502b4a6ee86e52e0dca", // claude-haiku-4-5
  // explorer components
  "0xf9b16a9fb4c2f828d050927eb671f35a769e54caaa92972b146dbff260cf498b", // mcp-slack
  "0x1040549ee67949cb36b3798f233e512d22eb3fa1be6c0aec243e334f3d19911c", // mcp-linear
  "0xfe619f12ad94fffcca9a12b929e7b941658c3dd4d95c448adf796b9198ec5d3d", // mcp-figma
  "0xdd62718b2cca9dfbb8a7a444b8a820fdcb4c95772ac8f57d2b9f1c864229e12a", // gpt-4o
  "0x03e12f8c8f731db56f918b0d3d7caee46a64733ba81b31ad006bc5cb43b4ee14", // thegraph
  "0x1d69b42a0cc634b1bed075ae279095fa44790bc4ce76049c7236db14c9a0f3df", // safe-sdk
  "0x7fd8cee3892c9849f743cba34c30a42f2e226a639e078f5e72eb2fe3d1d07f34", // vercel-ai-sdk
  "0x2da5cde8305bcae752ce9c8e41b230faf571c9467c497cbcd420d9bec1b3ded8", // langchain
  "0xe1a9ddb2843e940e51bc08b36029b6ed0744ed9309662b1e1b46ed48f296e949", // smart-contract-audit-skill
  "0x25bd6994e80ff2b809eaa576af8a98b20dacda23e432b97e7a6120c29eb63324", // mcp-brave-search
];

const ATOMS_QUERY = `
  query GetDeployedAtoms($ids: [String!]!) {
    atoms(
      where: { term_id: { _in: $ids } }
      order_by: { term: { total_market_cap: desc } }
    ) {
      term_id
      label
      image
      type
      created_at
      value {
        thing {
          url
          name
          description
        }
      }
      term {
        total_assets
        total_market_cap
        vaults(where: { curve_id: { _eq: "1" } }) {
          position_count
          current_share_price
          total_shares
          total_assets
          market_cap
        }
      }
      as_subject_triples {
        term_id
        predicate {
          term_id
          label
        }
        object {
          term_id
          label
          image
        }
        term {
          total_market_cap
          total_assets
          vaults(where: { curve_id: { _eq: "1" } }) {
            position_count
            total_shares
            total_assets
            market_cap
          }
        }
      }
    }
  }
`;

export interface OnChainAtom {
  term_id: string;
  label: string;
  image: string | null;
  type: string;
  created_at: string;
  name: string;
  description: string;
  url: string;
  componentType: string | null;
  contexts: string[];
  totalMarketCap: string;
  positionCount: number;
  triples: {
    predicate: string;
    object: string;
    objectId: string;
    marketCap: string;
    positionCount: number;
  }[];
}

function formatMarketCap(raw: string | null | undefined): string {
  if (!raw) return "0";
  const n = Number(raw);
  if (isNaN(n)) return "0";
  // Values are in wei (18 decimals), convert to readable
  const eth = n / 1e18;
  if (eth >= 1000) return `${(eth / 1000).toFixed(1)}k`;
  if (eth >= 1) return eth.toFixed(1);
  if (eth >= 0.01) return eth.toFixed(2);
  return eth.toFixed(4);
}

function parseAtom(raw: any): OnChainAtom {
  const thing = raw.value?.thing;
  const triples = (raw.as_subject_triples ?? []).map((t: any) => ({
    predicate: t.predicate?.label ?? "",
    object: t.object?.label ?? "",
    objectId: t.object?.term_id ?? "",
    marketCap: formatMarketCap(t.term?.total_market_cap),
    positionCount: t.term?.vaults?.[0]?.position_count ?? 0,
  }));

  // Extract component type from "is-best-of" triple (case-insensitive match)
  const typeTriple = triples.find(
    (t: any) => t.predicate.toLowerCase().replace(/[\s-]/g, "") === "isbestof",
  );

  // Extract contexts from deployed.json nested triples (by term_id)
  const contexts = getContextsByTermId(raw.term_id);

  return {
    term_id: raw.term_id,
    label: raw.label ?? thing?.name ?? "Unknown",
    image: raw.image,
    type: raw.type,
    created_at: raw.created_at,
    name: thing?.name ?? raw.label ?? "Unknown",
    description: thing?.description ?? "",
    url: thing?.url ?? "",
    componentType: typeTriple?.object?.toLowerCase() ?? null,
    contexts,
    totalMarketCap: formatMarketCap(raw.term?.total_market_cap),
    positionCount: raw.term?.vaults?.[0]?.position_count ?? 0,
    triples,
  };
}

export function useAtoms() {
  const [atoms, setAtoms] = useState<OnChainAtom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAtoms() {
      try {
        const data = await gqlFetch<{ atoms: any[] }>(ATOMS_QUERY, {
          ids: COMPONENT_IDS,
        });

        if (cancelled) return;

        const parsed = data.atoms.map(parseAtom);
        setAtoms(parsed);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to fetch atoms:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAtoms();
    return () => {
      cancelled = true;
    };
  }, []);

  return { atoms, loading, error };
}
