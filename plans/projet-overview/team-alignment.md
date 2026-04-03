# Wispr — Team Alignment

> The trust-scored discovery engine for AI agent components.
> Describe your need. Get a blueprint. Every recommendation is backed by experts with skin in the game.

---

## The Problem

The web3 community is approaching agentic reputation the wrong way. An agent is just a name on top of volatile components — skills, LLMs, MCP servers, APIs, libraries. **It's the reputation of individual components that matters.**

Current state:
- **Extreme fragmentation** — hundreds of agents, MCPs, packages, skills, with no intelligent discovery layer
- **No composition** — you can find a single tool, but not assemble a coherent stack for a specific need
- **Opaque trust** — a tool's reputation relies on GitHub stars, download counts (e.g. skills.sh), or marketing — no verifiable signal
- **Frozen priors** — LLMs don't know what really works in your context, in 2025, with your stack
- **No collective memory** — thousands of developers solve the same problems, and that experience disappears

---

## The Vision

**Wispr** is where agentic users' collective intelligence becomes the context for AI responses.

Before generating, Wispr queries a **living knowledge graph** built by practitioners who've shipped. The AI receives **pre-resolved context**: which components work, validated by real humans on-chain. It doesn't explore. It executes.

This is not a chatbot with a better prompt. It's a new paradigm — AI learns through continuous community attestation, not training.

---

## Three Actors

### Level 1 — User, no wallet
- Full access through a single text field
- Swipe onboarding detects profile (role + AI maturity)
- Describes need in natural language → receives a personalized blueprint
- Zero blockchain friction, zero account needed

### Level 2 — User, wallet connected
- Stacks saved on-chain, portable across apps
- Can follow tools, track history, unlock Community Sets
- No curation responsibilities
- A connected wallet does not make someone a curator

### Level 3 — Curator, explicit opt-in
- Deliberate onboarding: declares expertise domains, tools used in production, identity links (ENS, GitHub, Farcaster)
- Stakes $TRUST on components they validate
- Reputation is portable cross-app on Intuition
- Domain expertise built from declared signals + peer validation

---

## User Flow

### 1. Swipe `/swipe`

Adaptive card deck, max 8 questions, no account needed.

**Block 1 — Role** (max 4 questions)
```
I write code that runs on a blockchain?
├── Yes → I build the frontend of my dApp?
│         ├── Yes → Full Stack Web3
│         └── No  → Smart Contract Dev
└── No  → I spend more time in Figma than in a code editor?
          ├── Yes → Designer
          └── No  → I define what gets built, not how?
                    ├── Yes → I work closely with the dev team?
                    │         ├── Yes → Product Manager
                    │         └── No  → Founder
                    └── No  → I own the backend and infra?
                              ├── Yes → Backend Dev
                              └── No  → Frontend Dev
```

**Block 2 — AI Maturity** (max 4 questions)
```
I use AI beyond chatting?
├── No  → Beginner
└── Yes → I've set up a local AI agent?
          ├── No  → Intermediate
          └── Yes → I've installed MCP servers?
                    ├── No  → Advanced
                    └── Yes → I've orchestrated multiple agents?
                              ├── Yes → Expert
                              └── No  → Advanced
```

Output: `Profile { role, level }` → used to personalize everything downstream.

---

### 2. Intent `/chat`

After profiling, the user lands on a **single text field**.

> "I want to build a Next.js app with Google auth and an admin dashboard"

The Wispr Agent:
1. **Extracts semantic claims** from the intent (framework, features, constraints)
2. **Queries the Intuition knowledge graph** filtered by profile context + reputation threshold
3. **Composes an executable blueprint** — not a list, but a plan: which tools, in what order, why, with what cost and risk

The response is displayed as a **live visual construction** — animated blocks appear in real-time as the AI resolves each component. Each block shows: tool name, trust score, active curators. Not a loading spinner. A visible building process.

---

### 3. Blueprint `/blueprint`

The generated blueprint is both visual and actionable:

- **Visual gallery** — each component as a card with trust score, curator count, reasoning
- **System Prompt** — editable textarea, one-click copy
- **MCP Config** — toggleable servers, generates `claude_desktop_config.json`, one-click copy
- **Packages** — install command, one-click copy
- **LLMs** — recommended models with reasoning
- **One-shot install prompt** — single command to configure your local environment
- **Publish on-chain** — Intuition triples + ENS subname `{name}.wispr.eth`

Trust scores "breathe" — they fluctuate in real-time as curators stake/unstake. Click any component to see who staked and how much — visible skin in the game.

If the user is unsatisfied → **CTA "Contribute to Wispr"** → become a curator. The app doubles as the entry point for the curator persona.

---

### 4. Explorer `/explorer`

Two tabs:

**Components** — catalogue filtered by detected profile
- Recommended components appear first, highlighted
- Filter bar: All / LLM / MCP / Package / API / Skill
- Each card: name · trust score · curator count · Add/Remove
- Live trust scores that fluctuate as curators stake/unstake

**Community Sets** — browse other builders' blueprints
- Filter by role and level
- Each set card: profile badge · $TRUST score · first 3 tools visible
- Full set locked — stake $TRUST to unlock → stake goes to the set's bonding curve
- The more a set is staked, the higher it rises in ranking

---

### 5. Battle `/battle`

Compare your blueprint against another builder's:
- Input: wallet address or ENS of the challenger
- Split view: my blueprint vs theirs
- Shared tools highlighted, divergences explained
- Compatibility score
- Shareable URL

---

## The Knowledge Graph — Intuition Protocol

Intuition Protocol **is** the knowledge graph. It's the foundational data layer: user preferences (component X for context Y) are stored as on-chain triples. The protocol provides the permissionless structure and signal credibility.

**Recommendation engine is fully delegated to Intuition's MCP**, which relies on TVL (Total Value Locked) as the ranking signal. Economics (staking, bonding curves, rewards) are handled by Intuition Protocol natively.

### Normalized Registry

Every component follows a strict schema:

| Field | Description |
|---|---|
| Type | `agent` / `skill` / `mcp` / `api` / `package` / `llm` |
| Capabilities | What it accomplishes (`oauth-sessions`, `orm-querying`, `edge-deployment`) |
| Domains | Usage contexts (`nextjs-app-router`, `python-fastapi`, `react-native`) |
| Inputs / Outputs | Expected data flow |
| Permissions | Auth model, required access |
| Cost | API pricing, gas, integration time |
| Risk | Audit status, uptime, autonomy level |
| Compatibility | Works with / incompatible with |

### Data Model — Nested Triples

| Level | Triple | Type |
|---|---|---|
| T1 | `(tool_atom, is-a, "mcp-server")` | Classification |
| T2 | `(curator, attests, tool_atom)` + $TRUST deposit | Stake |
| T2b | `(T2, in-context, use_case_atom)` | Contextual |
| T3 | `(curator2, agree-with, T2)` → peer rep increases | Meta-reputation |
| T4 | `(curator2, disputes, T2)` → partial stake slash | Dispute |
| T5 | `(user, built-with, stack_atom)` | Usage signal |
| T6 | `(stack_atom, includes, tool_atom)` ×N | Composition |

---

## Curator Profiles

### Onboarding — active declaration
- **Expertise domains** — DeFi, RAG, TypeScript, web scraping, etc.
- **Tools used in production today** — what they actually run
- **Verifiable identity links** — ENS, Farcaster, GitHub
- **Self-assessed level per domain** — builder / expert / researcher

Every answer = on-chain Triple immediately.

### Peer validation
- Anyone can `agree-with` or `dispute` a claim
- Validated claims gain weight, disputed claims lose weight
- Sybil-resistant: validating a false claim costs $TRUST

### Domain expertise score
```
domain_expertise(curator, category) =
    validated_claims × (agreements / total_attestations) × recency_factor
```

---

## The Learning Flywheel

### User loop
```
User queries → intent atoms on-chain
    ↓
Agent recommends → blueprint from trust graph
    ↓
User adopts tools → real usage signal on-chain
    ↓
Usage validates attestations → confirms or weakens curator stakes
    ↓
Better trust signal → sharper next recommendation
    ↑─────────────────────────────────────────┘
```

### Curator loop
```
Curator declares expertise → low-weight triples on-chain
    ↓
Curator stakes on tools → trust signal enters scoring
    ↓
Peers validate claims → domain expertise score rises
    ↓
Higher expertise score → attestations carry more weight
    ↓
More weight → more adoption of staked tools
    ↓
More adoption → reputation compounds further
    ↑────────────────────────────────────────┘
```

---

## Wispr Skill — Direct LLM Access

Equivalent of `find-skill` (skills.sh / Vercel Labs) but powered by Wispr's knowledge graph. Allows an LLM to **dynamically load the right skills and resources based on context** — no manual configuration needed. Same Wispr Agent on the backend, exposed as an installable skill/MCP.

---

## Feedback API

Collects feedback throughout the course of a project (called by the Wispr Skill during usage). No web3 transaction required — accessible to everyone. Free to consult for curators to broaden or reassess their recommendations. Closes the feedback loop: intent → recommendation → real usage → feedback → better curation.

---

## Project Components

| # | Component | Description |
|---|---|---|
| 1 | **Novice App — "Wispr Chat"** | AI chatbox → intent → animated blueprint + one-shot install + curator CTA |
| 2 | **Wispr Agent** | Standalone: extracts semantic claims, queries Intuition graph, composes blueprint |
| 3 | **Wispr Skill / MCP** | Dynamic component loader for LLMs — direct access without the app |
| 4 | **Feedback API** | Collects usage feedback, consultable by curators, no web3 required |
| 5 | **Ontology & Seed Data** | Initial knowledge graph schema + 10-15 pre-seeded components |
| 6 | **Curator App — "Wispr Onboarding"** | Swipe profiling + curation dashboard + battle/bundle comparison |

---

## The Wow Moments

### 1. Live Construction
Stack blocks animate and place themselves as the AI analyzes your need. A visible building process, not a loader.

### 2. Breathing Trust Scores
Trust scores fluctuate in real-time as curators stake and unstake. A living market signal, not dead review counts.

### 3. Visible Skin in the Game
Click any tool to see who staked on it. Real wallet addresses. Real amounts. Humans putting capital at risk to vouch for quality.

### 4. Zero to Blueprint in 60 Seconds
Swipe 8 questions → describe your need → executable blueprint ready. No API keys. No repo cloning. No prompt engineering.

---

## What Wispr Is Not

- **Not a tool search engine.** Reputation is an internal signal serving generation, not a product in itself.
- **Not a review platform.** Curators are practitioners identified on-chain, not anonymous reviewers.
- **Not an improved LLM.** It doesn't change the model. It changes what the model receives before responding.
- **Not a static directory.** Every interaction enriches the graph. The system learns continuously.

---

## 30-Second Pitch

> "AI agents don't have an intelligence problem — they have a discovery, composition, and trust problem."
>
> **Wispr is the trust-scored discovery engine for AI agent components.**
>
> Describe your need in plain English. Our AI queries a community-curated knowledge graph on Intuition Protocol where real experts stake $TRUST on the tools they recommend. You get an executable blueprint in under a minute — not a list of tools, but a plan: what to use, in what order, and why.
>
> Connecting a wallet gives you portability. Becoming a curator means putting skin in the game. Invisible to the end user. Verifiable on-chain.
