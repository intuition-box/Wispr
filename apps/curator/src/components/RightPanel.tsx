"use client";

const TRENDING = [
  { category: "DeFi", name: "Chainlink Data Feeds", trust: "2.4k $TRUST · 31 curators" },
  { category: "MCP Server", name: "GitHub MCP", trust: "1.8k $TRUST · 24 curators" },
  { category: "Package", name: "viem", trust: "1.2k $TRUST · 19 curators" },
  { category: "LLM", name: "Claude Sonnet 4", trust: "3.1k $TRUST · 42 curators" },
];

const VALIDATIONS = [
  {
    initials: "JL",
    type: "agree" as const,
    user: "jade.eth",
    action: "agrees with your stake on",
    target: "GitHub MCP",
    context: "in AI Agents",
    time: "2h",
  },
  {
    initials: "ZK",
    type: "dispute" as const,
    user: "zet.eth",
    action: "disputes your stake on",
    target: "Hardhat",
    context: "in DeFi",
    time: "5h",
  },
  {
    initials: "WZ",
    type: "agree" as const,
    user: "wieedze.eth",
    action: "agrees with your stake on",
    target: "Claude Opus 4",
    context: "in Agent Orchestration",
    time: "8h",
  },
];

export function RightPanel() {
  return (
    <aside className="right-panel">
      <div className="panel-search">
        <span className="panel-search-icon">🔍</span>
        <input
          className="panel-search-input"
          type="text"
          placeholder="Search components"
        />
      </div>

      <div className="panel-card">
        <div className="panel-card-header">Trending</div>
        {TRENDING.map((item) => (
          <div key={item.name} className="panel-card-item">
            <div>
              <div className="trending-category">{item.category}</div>
              <div className="trending-name">{item.name}</div>
              <div className="trending-trust">{item.trust}</div>
            </div>
          </div>
        ))}
        <div className="panel-card-footer">
          <button>Show more</button>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-card-header">Peer validations</div>
        {VALIDATIONS.map((v, i) => (
          <div key={i} className="validation-item">
            <div className={`validation-avatar ${v.type}`}>{v.initials}</div>
            <div className="validation-body">
              <div className="validation-text">
                <strong>{v.user}</strong> {v.action}{" "}
                <span className="highlight">{v.target}</span> {v.context}
              </div>
              <div className="validation-time">{v.time} ago</div>
              <div className="validation-actions">
                <button className="validation-btn agree-btn">Agree</button>
                <button className="validation-btn dispute-btn">Dispute</button>
              </div>
            </div>
          </div>
        ))}
        <div className="panel-card-footer">
          <button>Show more</button>
        </div>
      </div>
    </aside>
  );
}
