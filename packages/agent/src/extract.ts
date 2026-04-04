import { extractTriples, type Triple } from "./intuition/tools.js";
import type { SemanticClaims } from "./types/semantic-claims.js";

// extract — parse user intent into semantic claims via Intuition extract_triples
export async function extract(intent: string): Promise<SemanticClaims> {
  const triples = await extractTriples(intent);

  return {
    frameworks: collectObjects(triples, "uses-framework"),
    features: collectObjects(triples, "requires-feature"),
    constraints: collectObjects(triples, "has-constraint"),
    domains: collectObjects(triples, "targets-domain"),
    raw: intent,
  };
}

function collectObjects(triples: Triple[], predicate: string): string[] {
  return triples
    .filter((t) => t.predicate === predicate)
    .map((t) => t.object);
}
