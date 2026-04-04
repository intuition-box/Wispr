// Mock prompts - mapping user input to stack IDs

export interface MockPrompt {
  id: string;
  userPrompt: string;
  matchKeywords: string[];
  stackId: string;
}

export const mockPrompts: MockPrompt[] = [
  {
    id: "w4",
    userPrompt: "I want my Notion notes to become Twitter threads posted automatically every week",
    matchKeywords: ["notion", "twitter", "thread", "automatic", "weekly", "social"],
    stackId: "w4-notion-to-twitter"
  },
  {
    id: "p3",
    userPrompt: "I want my DeFi portfolio to automatically rebalance according to my risk tolerance",
    matchKeywords: ["defi", "portfolio", "rebalance", "risk", "swap", "crypto"],
    stackId: "p3-defi-rebalancing"
  }
];
