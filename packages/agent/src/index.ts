// Wispr Agent — core pipeline
//
// extract(intent) → SemanticClaims   via Intuition extract_triples
// query(claims)   → RankedComponent[] via Intuition search_atoms + search_lists
// compose(...)    → Blueprint         (TODO: downstream step)

export { extract } from "./extract.js";
export { query } from "./query.js";

export type { SemanticClaims } from "./types/semantic-claims.js";
export type { Blueprint, MCPConfig, PackageInstall, LLMRecommendation } from "./types/blueprint.js";
export type { RankedComponent } from "./types/ranked-component.js";
