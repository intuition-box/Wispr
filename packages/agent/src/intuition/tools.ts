import { getIntuitionClient } from "./client.js";

export interface Triple {
  subject: string;
  predicate: string;
  object: string;
}

export interface Atom {
  id: string;
  label: string;
  description?: string;
  url?: string;
}

// extract_triples — parse natural language into structured triples
export async function extractTriples(input: string): Promise<Triple[]> {
  const client = await getIntuitionClient();
  const result = await client.callTool({ name: "extract_triples", arguments: { input } });
  return (result.content as { text: string }[])
    .map((c) => {
      try {
        return JSON.parse(c.text);
      } catch {
        return null;
      }
    })
    .flat()
    .filter(Boolean) as Triple[];
}

// search_atoms — search the knowledge graph by keywords
export async function searchAtoms(queries: string[]): Promise<Atom[]> {
  const client = await getIntuitionClient();
  const result = await client.callTool({ name: "search_atoms", arguments: { queries } });
  return (result.content as { text: string }[])
    .map((c) => {
      try {
        return JSON.parse(c.text);
      } catch {
        return null;
      }
    })
    .flat()
    .filter(Boolean) as Atom[];
}

// search_lists — search named entity lists (e.g. "mcp servers", "nextjs tools")
export async function searchLists(query: string): Promise<Atom[]> {
  const client = await getIntuitionClient();
  const result = await client.callTool({ name: "search_lists", arguments: { query } });
  return (result.content as { text: string }[])
    .map((c) => {
      try {
        return JSON.parse(c.text);
      } catch {
        return null;
      }
    })
    .flat()
    .filter(Boolean) as Atom[];
}
