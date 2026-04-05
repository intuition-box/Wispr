import deployed from "../../../../packages/ontology/src/seed/deployed.json";

const atomIds = deployed.atoms as Record<string, string>;
const baseTriples = deployed.triples.base as Record<string, string>;
const nestedTriples = deployed.triples.nested as Record<string, string>;

export function getTermId(slug: string): string | null {
  return atomIds[slug] ?? null;
}

// Map atom term_id → { contexts, nestedTripleIds }
interface AtomContextInfo {
  contexts: string[];
  nestedTripleIds: Record<string, string>; // context → nestedTripleTermId
}

const atomContextMap: Record<string, AtomContextInfo> = {};

// Parse nested triple keys: "T1-mcp-github→code-analysis"
for (const [key, nestedTermId] of Object.entries(nestedTriples)) {
  const match = key.match(/^(T1-.+?)→(.+)$/);
  if (!match) continue;
  const [, baseKey, context] = match;

  // Get the base triple term_id
  const baseTermId = baseTriples[baseKey];
  if (!baseTermId) continue;

  // Find which atom slug this base triple belongs to
  // baseKey is like "T1-mcp-github" → component slug contains the part after "T1-"
  const componentPart = baseKey.replace("T1-", "");
  const atomSlug = Object.keys(atomIds).find(
    (s) => s === componentPart || s.startsWith(componentPart),
  );
  if (!atomSlug) continue;

  const atomTermId = atomIds[atomSlug];
  if (!atomContextMap[atomTermId]) {
    atomContextMap[atomTermId] = { contexts: [], nestedTripleIds: {} };
  }
  atomContextMap[atomTermId].contexts.push(context);
  atomContextMap[atomTermId].nestedTripleIds[context] = nestedTermId;
}

// Lookup by atom term_id (what useAtoms returns)
export function getContextsByTermId(atomTermId: string): string[] {
  return atomContextMap[atomTermId]?.contexts ?? [];
}

// Get the nested triple term_id for staking on a specific context
export function getNestedTripleId(atomTermId: string, context: string): string | null {
  return atomContextMap[atomTermId]?.nestedTripleIds[context] ?? null;
}

export function getAllContexts(): string[] {
  const ctxSet = new Set<string>();
  for (const info of Object.values(atomContextMap)) {
    for (const ctx of info.contexts) ctxSet.add(ctx);
  }
  return Array.from(ctxSet).sort();
}

// Keep backward compat for slug-based lookup
export function getContexts(slug: string): string[] {
  const termId = atomIds[slug];
  if (!termId) return [];
  return getContextsByTermId(termId);
}
