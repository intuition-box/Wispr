# Wispr — Unified Vision

> The trust-scored discovery engine for AI agent components.
> Describe your need. Get a blueprint. Every recommendation is backed by experts with skin in the game.

---

## Core Insight (Zet)

The web3 community is approaching agentic reputation the wrong way. An agent is just a name on top of volatile components. **It's the reputation of individual components that matters** — which LLM, which MCP server, which skill, in which context.

Wispr is a **permissionless knowledge graph** of AI agent components where experienced practitioners stake their conviction on quality. The graph feeds an AI matching engine that turns a natural language intent into an executable blueprint.

---

## The Problem

- **Extreme fragmentation** — hundreds of agents, MCPs, packages, skills, with no intelligent discovery layer
- **No composition** — you can find a single tool, but not assemble a coherent stack for a specific need
- **Opaque trust** — a tool's reputation relies on GitHub stars or marketing, no verifiable signal
- **Frozen priors** — LLMs don't know what really works in your context, in 2025, with your stack
- **No collective memory** — thousands of developers make the same mistakes, and that experience disappears

---

## Three Actors, Three Levels

The distinction matters. Wallet ≠ curator. Becoming a curator is a deliberate act.

### Level 1 — User, no wallet
- Full access via a single text field
- Swipe onboarding detects profile (role + AI maturity)
- Describes need in natural language → receives a personalized blueprint
- Zero blockchain friction, zero account needed

### Level 2 — User, wallet connected
- Stacks saved on-chain, portable across apps
- Can follow tools, track history, unlock Community Sets
- No curation responsibilities

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

Output: `Profile { role, level }` → stored in Zustand, used to personalize everything downstream.

---

### 2. Intent `/chat`

After profiling, the user lands on a **single text field**.

> "I want to build a Next.js app with Google auth and an admin dashboard"

The Wispr Agent:
1. **Extracts semantic claims** from the intent (framework, features, constraints)
2. **Queries the Intuition knowledge graph** filtered by profile context + reputation threshold
3. **Composes an executable blueprint** — not a list, a plan: which tools, in what order, why, with what cost and risk (Jade)

The response is displayed as a **live visual construction** (Wieedze) — animated blocks appear in real-time as the AI resolves each component. Each block shows: tool name, trust score, active curators. Not a loading spinner. A visible building process.

---

### 3. Blueprint `/blueprint`

The generated blueprint is both visual and actionable:

- **Visual gallery** — each component as a card with trust score, curator count, reasoning (Zet)
- **System Prompt** — editable textarea, one-click copy
- **MCP Config** — toggleable servers, generates `claude_desktop_config.json`, one-click copy
- **Packages** — install command, one-click copy
- **LLMs** — recommended models with reasoning
- **One-shot install prompt** — single command to configure your local environment (Zet)
- **Publish on-chain** — Intuition triples + ENS subname `{name}.wispr.eth`

Users can **manually swap components** in the blueprint — the trust score updates live as the stack changes.

---

### 4. Explorer `/explorer`

For users who want to browse rather than describe:

**Components** — catalogue filtered by detected profile
- Recommended components appear first, highlighted
- Filter bar: All / LLM / MCP / Package / API / Skill
- Each card: name · trust score · curator count · Add/Remove
- Live trust scores that fluctuate as curators stake/unstake (Wieedze)

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

Without normalization, matching is impossible.

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

### Scoring Formula

```
score = semantic_relevance + compatibility + trust_signal − cost − risk

trust_signal = Σ (stake_amount × curator_global_rep × domain_expertise × freshness)
```

A DeFi expert staking on a trading tool carries more weight than a generalist — even if the generalist has higher global reputation.

---

## Curator Profiles 

### Onboarding — active declaration
- Expertise domains (DeFi, RAG, TypeScript, web scraping...)
- Tools used in production today
- Verifiable identity links (ENS, Farcaster, GitHub)
- Self-assessed level per domain

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

## Feedback Loop

The missing piece that closes the cycle:

```
Intent → Recommendation → Real usage → Feedback → Better curation
```

**Wispr Feedback API:**
- Collects feedback throughout a project (called by the Wispr Skill during usage)
- No web3 transaction required — accessible to everyone
- Free to consult for curators: broadens or reassesses their recommendations
- Every feedback signal enriches the graph passively

---

## Wispr Skill / MCP — Direct LLM Access 

Wispr is not just an app. It's an **installable capability** for any LLM environment.

- Query component recommendations directly from Claude, Cursor, or any agent framework
- Same Wispr Agent on the backend, exposed as an MCP server
- No need to leave your IDE — Wispr comes to you
- This is the distribution moat: Wispr embedded in every developer's workflow

---

## Partners

| Partner | Usage |
|---|---|
| **Intuition Protocol** | Knowledge graph — components, attestations, reputation |
| **ENS** | Portable identity — `{name}.wispr.eth` |
| **0G** | Decentralized config storage + compute |
| **Reown** | Multi-chain wallet connection |

---

## Hackathon Scope

### P0 — Core Demo
- Swipe onboarding (profile detection in <2 min)
- Natural language intent → AI-powered blueprint generation
- Live visual construction (animated block UI)
- Blueprint export (system prompt, MCP config, packages, install command)
- Explorer catalogue with trust scores
- Publish blueprint to Intuition (on-chain attestations)
- Seed registry: 10-15 pre-seeded components with initial ontology (Zet)

### P1 — Post-hackathon
- Wallet connect (Reown) + 3-level actor system
- ENS subname registration
- Community Sets with staking to unlock
- Battle mode
- Wispr Skill/MCP (direct LLM access)
- Feedback API (closes the loop)
- Curator dashboard with peer validation
- Real staking mechanism + curator rewards

---

## The Wow Moments

### 1. Live Construction
Stack blocks animate and place themselves as the AI analyzes your need. A visible building process, not a loader.

### 2. Breathing Trust Scores
Trust scores fluctuate in real-time as curators stake and unstake. "847 $TRUST staked by 23 curators" — a living market signal.

### 3. Visible Skin in the Game
Click any tool to see who staked on it. Real wallet addresses. Real amounts. Humans putting capital at risk to vouch for quality.

### 4. Zero to Blueprint in 60 Seconds
Swipe 8 questions → describe your need → executable blueprint ready. No API keys. No repo cloning. No prompt engineering.

---

## 30-Second Pitch

> "AI agents don't have an intelligence problem — they have a discovery, composition, and trust problem."
>
> **Wispr is the trust-scored discovery engine for AI agent components.**
>
> Describe your need in plain English. Our AI queries a community-curated knowledge graph on Intuition Protocol where real experts stake $TRUST on the tools they recommend. You get an executable blueprint in under a minute — not a list of tools, but a plan: what to use, in what order, and why.
>
> Connecting a wallet gives you portability. Becoming a curator means putting skin in the game. Invisible to the end user. Verifiable on-chain.

---

## Key Differentiators

1. **Component reputation, not agent reputation** — we evaluate building blocks, not wrappers (Zet)
2. **Blueprint, not list** — we don't say "here are some tools", we say "here is exactly what to assemble, in what order, and why" (Jade)
3. **Collective intelligence as AI context** — the graph enriches every LLM response with practitioner knowledge (James)
4. **Wallet ≠ curator** — connecting a wallet is low-friction; becoming a curator is a committed act with $TRUST at stake (Jade)
5. **Wispr comes to you** — installable as MCP/Skill directly in your LLM environment (Zet)
6. **Feedback closes the loop** — intent → reco → usage → feedback → better curation (Zet)
7. **Invisible web3, maximum engagement** — the user sees a text field and results; the on-chain graph grows silently (Jade + James)

---

## Credits

This vision synthesizes contributions from all team members:
- **Sam** — Swipe onboarding, Explorer/catalogue UX, Community Sets, Battle mode, ENS identity
- **James** — Collective intelligence paradigm, knowledge graph as AI context layer, curator-via-CTA flow
- **Wieedze** — 3-layer architecture, wow effects (live construction, breathing scores), natural language input
- **Jade** — Normalized registry, scoring formula, 3 actor levels, nested triples, curator profiles with peer validation
- **Zet** — Component-level reputation, Wispr Skill/MCP, Feedback API, initial ontology & seed data
