const GRAPHQL_URL =
  process.env.INTUITION_GRAPHQL_URL ?? "https://mainnet.intuition.sh/v1/graphql";

const QUERY = `
  query LookupAtom($likeStr: String!) {
    atoms(
      where: {
        _or: [
          { data: { _ilike: $likeStr } }
          { value: { thing: { name: { _ilike: $likeStr } } } }
          { value: { thing: { description: { _ilike: $likeStr } } } }
          { value: { organization: { name: { _ilike: $likeStr } } } }
          { label: { _ilike: $likeStr } }
        ]
      }
      order_by: { term: { total_market_cap: desc } }
      limit: 3
    ) {
      term_id
      label
      type
      term {
        total_market_cap
        vaults(where: { curve_id: { _eq: "1" } }) {
          term_id
          position_count
          market_cap
        }
      }
      as_subject_triples(limit: 5) {
        term_id
        predicate { term_id label }
        object    { term_id label }
        term {
          total_market_cap
          vaults(where: { curve_id: { _eq: "1" } }) {
            term_id
            position_count
            market_cap
          }
        }
        counter_term {
          total_market_cap
          vaults(where: { curve_id: { _eq: "1" } }) {
            term_id
            position_count
            market_cap
          }
        }
      }
    }
  }
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) return Response.json({ error: "name required" }, { status: 400 });

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: QUERY, variables: { likeStr: `%${name}%` } }),
      signal: AbortSignal.timeout(8000),
    });

    const json = await res.json() as { data?: { atoms?: any[] }; errors?: any[] };

    if (json.errors) {
      return Response.json({ error: json.errors[0]?.message ?? "GraphQL error" }, { status: 500 });
    }

    const atoms = json.data?.atoms ?? [];
    if (atoms.length === 0) return Response.json({ atom: null });

    const atom = atoms[0];
    const vault = atom.term?.vaults?.[0];

    return Response.json({
      atom: {
        termId:    atom.term_id,
        label:     atom.label,
        vaultTermId: vault?.term_id ?? null,
        positionCount: vault?.position_count ?? 0,
        marketCap: vault?.market_cap ?? "0",
        triples: (atom.as_subject_triples ?? []).map((t: any) => ({
          tripleTermId:        t.term_id,
          predicate:           t.predicate?.label,
          object:              t.object?.label,
          vaultTermId:         t.term?.vaults?.[0]?.term_id ?? null,
          counterVaultTermId:  t.counter_term?.vaults?.[0]?.term_id ?? null,
          forCount:            t.term?.vaults?.[0]?.position_count ?? 0,
          againstCount:        t.counter_term?.vaults?.[0]?.position_count ?? 0,
        })),
      },
    });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
