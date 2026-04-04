// Mock blueprints - output data for UI display

export interface BlueprintComponent {
  name: string;
  description: string;
  url: string;
  type: "tool" | "skill" | "model";
  trustScore: number;
  curatorCount: number;
  role: string;
}

export interface Blueprint {
  components: BlueprintComponent[];
  flow: string;
  infrastructure?: string[];
  customCode?: string[];
}

export const mockBlueprints: Record<string, Blueprint> = {
  "w4-notion-to-twitter": {
    components: [
      {
        name: "MCP Notion",
        description: "Model Context Protocol server for Notion - reads databases and pages",
        url: "https://github.com/makenotion/notion-mcp-server",
        type: "tool",
        trustScore: 9.1,
        curatorCount: 25,
        role: "Reads notes from Notion database"
      },
      {
        name: "MCP Twitter",
        description: "Model Context Protocol server for Twitter - posts tweets and threads",
        url: "https://github.com/EnesCinr/twitter-mcp",
        type: "tool",
        trustScore: 8.5,
        curatorCount: 20,
        role: "Posts the generated thread"
      },
      {
        name: "Claude Sonnet 4.5",
        description: "Long-form generation, reasoning, tone control",
        url: "https://docs.anthropic.com/en/docs/about-claude/models",
        type: "model",
        trustScore: 9.4,
        curatorCount: 41,
        role: "Generates Twitter thread content"
      },
      {
        name: "brand-voice-skill",
        description: "AI service that analyzes user's writing style and applies it to new content",
        url: "whisper.xyz/skills/brand-voice",
        type: "skill",
        trustScore: 8.8,
        curatorCount: 22,
        role: "Maintains consistent brand voice"
      }
    ],
    flow: "Cron triggers → MCP Notion reads notes → Claude Sonnet + brand-voice-skill generate thread → MCP Twitter posts",
    infrastructure: [
      "Weekly cron job (Vercel Cron, GitHub Actions, AWS EventBridge, etc.)"
    ]
  },

  "p3-defi-rebalancing": {
    components: [
      {
        name: "Chainlink Data Feeds",
        description: "Real-time on-chain price oracles for crypto assets",
        url: "https://docs.chain.link/data-feeds",
        type: "tool",
        trustScore: 9.5,
        curatorCount: 38,
        role: "Provides live asset prices"
      },
      {
        name: "1inch Fusion+ SDK",
        description: "Optimal swap execution with MEV protection and guaranteed slippage",
        url: "https://docs.1inch.io/docs/fusion-swap",
        type: "tool",
        trustScore: 9.3,
        curatorCount: 32,
        role: "Executes swaps at best price"
      },
      {
        name: "Privy Embedded Wallet",
        description: "Embedded wallet solution for seamless transaction signing",
        url: "https://docs.privy.io",
        type: "tool",
        trustScore: 9.1,
        curatorCount: 26,
        role: "Signs transactions in background"
      }
    ],
    flow: "Chainlink prices → Custom algo calculates swaps → 1inch executes swaps → Privy signs txs",
    customCode: [
      "Portfolio rebalancing algorithm (calculates deviations, determines swaps)"
    ]
  }
};
