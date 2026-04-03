## Global Vision

The AI agent ecosystem is fragmented: hundreds of agents, MCPs, packages and skills, with no intelligent discovery layer or common standard. There is no way to know which tools exist, which ones work well together, or which ones can be trusted.

**Wispr** is the npm registry for AI agents — but with a trust-scoring layer on top. A user describes their need in natural language and gets back a **complete, executable agent blueprint**. Curators feed the registry and stake **Trust** on every tool they recommend via Intuition Protocol. The more a tool is staked on by recognized experts, the higher it ranks.

> "The trust-scored discovery engine for AI agent capabilities."

---

## The Problem

- **Extreme fragmentation** — hundreds of agents, MCPs, packages and skills with no common standard and no intelligent discovery layer.
- **No composition** — it is possible to find a single tool, but not to assemble a coherent stack (orchestrator + tools + connectors + permissions) for a specific need.
- **Opaque trust** — a tool's reputation relies on marketing or GitHub stars. No verifiable signal, no skin-in-the-game.
- **Dead directories** — existing registries are static lists. No ranking, no compatibility checks, no community-driven updates.

---

## Value Proposition

### For the user
Describe your need in plain language. Get a complete, executable agent blueprint — not a list of tools, but a plan: which orchestrator, which tools, in what order, why, with what cost and what level of risk.

### For the curator
Submit the tools you know and stake Trust on them. Your reputation lives on-chain and is portable — if your recommendations are validated by the community, your weight grows across the entire Intuition ecosystem. Real skin-in-the-game.

### For the ecosystem
A verifiable knowledge graph of AI agent capabilities. Every interaction enriches the graph. Every stake reinforces or corrects reputation. Everything is open, portable, and censorship-resistant.

---

## The Three Actors

### Level 1 — User, no wallet
- Full access through a single plain text field
- Describes their need in natural language
- Receives a personalized agent blueprint
- All interactions are silently logged on-chain (query, saved stack)
- Zero visible blockchain friction

### Level 2 — User, wallet connected
- Connects a wallet voluntarily — for identity, portability, or persistence
- Saved stacks are on-chain and portable across apps
- Can follow tools and track query history
- No submission, no staking, no curation responsibilities
- The wallet is theirs — the experience stays Web2
- **A connected wallet does not make someone a curator**

### Level 3 — Curator, explicit opt-in
- Becomes a curator through a **deliberate, explicit act** in the interface
- Fills in their domain profile at onboarding: expertise areas, tools used in production, identity links
- Deposits a first Trust stake — the entry signal
- Unlocks the curation dashboard: submissions, staking, attestations, disputes, collections
- Reputation is portable cross-app on Intuition
- Domain expertise profile is built from declared signals and peer validation

---

## The 3 Product Layers

### 1 — Normalized Registry
The structured database of all agents, tools, MCPs, APIs and skills. Every entry follows a normalized schema — without this, matching is impossible.

**Key fields — Agent**
- Main objective, tasks it can perform
- Required / optional tools
- Autonomy level, guardrails
- Wallet needs, cost, reputation score
- Runtime environment

**Key fields — Tool / MCP / Skill**
- Type: `agent` / `skill` / `mcp` / `api` / `package`
- Expected inputs, produced outputs
- Required permissions, auth model
- Supported chains / ecosystems
- Pricing, rate limits, risk level
- Declared compatibility with other tools

**Added value:** a normalized schema means precise matching, meaningful comparison, and no spam directory. Without this layer, everything else collapses.

---

### 2 — Matching Engine (Agent)
Agent receives the user's query + the registry + the Intuition reputation graph. It decomposes the intent, extracts constraints, and composes an ordered, justified blueprint.

**Input** → NL query + registry + Intuition Trust graph
**Output** → blueprint: orchestrator + tools + order + permissions + cost + risk

**Scoring formula**
```
score = semantic_relevance + compatibility + trust_signal − cost − risk

trust_signal = Σ (stake_amount × curator_global_rep × domain_expertise × freshness)
```

- **Semantic relevance** — Agent determines whether the tool actually addresses the intent
- **Compatibility** — stack, chain, wallet, other already-selected tools
- **Trust signal** — weighted by curator global reputation AND their validated domain expertise on the tool's category
- **Cost / friction** — gas, API pricing, auth complexity, integration time
- **Risk** — audits, uptime, required permissions, agent autonomy level

A DeFi expert staking on a trading agent carries more weight than a generalist staking on the same tool — even if the generalist has a higher global reputation score.

**Added value:** we return an executable plan, not a list. The user knows exactly what to connect, in what order, and why. The ranking is transparent and explainable.

---

### 3 — Trust Layer (Intuition Protocol)
Every tool is an Atom. Every attestation is a Triple. Every curator stakes Trust — not just a like but an economic conviction. Nested triples enable reputation on top of reputation.

#### Data Model — Nested Triples

| Level | Triple | Type |
|---|---|---|
| T1 | `(tool_atom, is-a, "mcp-server")` | Atom + Simple |
| T2 | `(curator, attests, tool_atom)` + Trust deposit | Stake |
| T2b | `(T2, in-context, use_case_atom)` | Nested |
| T3 | `(curator2, agree-with, T2)` → peer rep increases | Meta |
| T4 | `(curator2, disputes, T2)` → partial stake slash | Meta |
| T5 | `(user, built-with, stack_atom)` | Usage |
| T6 | `(stack_atom, includes, tool_atom)` ×N | Composite |

#### Every Interaction = One Intuition Transaction

| Actor | Action | Triple created |
|---|---|---|
| User (any level) | Sends a query | `(user, queried, query_atom)` |
| User (any level) | Saves a stack | `(user, built-with, stack_atom)` + `(stack_atom, includes, tool)` ×N |
| Curator | Declares expertise | `(curator, expert-in, domain)` |
| Curator | Declares production usage | `(curator, uses-in-prod, tool_atom)` |
| Curator | Submits a tool | Atom + `(tool, is-a, type)` + `(tool, best-for, use_case)` |
| Curator | Stakes Trust | `(curator, attests, tool)` + Trust deposit |
| Curator | Attests (contextualized) | `(T_attest, in-context, use_case)` ← nested |
| Curator | Validates a peer | `(curator, agree-with, T_attest)` → reputation increases |
| Curator | Disputes | `(curator, disputes, T_attest)` → partial slash |

**Added value:** reputation is impossible to fake — it costs Trust. A recognized expert's attestations carry more weight. Reputation is portable cross-app across the entire Intuition ecosystem.

---

### 4 — Unified Interface

A single text field for everyone. The interface adapts based on context — not based on wallet presence alone.

- **No wallet** → full discovery experience, on-chain activity invisible
- **Wallet connected, not a curator** → stacks saved on-chain, portable identity, no curation UI
- **Explicit curator opt-in** → curation dashboard unlocked after deliberate onboarding
- **Ambiguous intent** → soft nudge toward curator onboarding, non-blocking

Agent detects intent in the free text: `find` (looking for tools) / `curate` (wants to contribute) / `both`.

---

### 5 — Curation Layer

Without curators, the registry becomes a spam directory. Curators are the human editorial layer that gives the base its value. Their contributions have a price — Trust — which naturally filters bad actors.

**Available actions**
- Submit a tool (on-chain Atom)
- Enrich existing metadata
- Stake Trust (conviction signal)
- Attest / dispute peer attestations
- Create thematic collections

**Collection examples**
- "Best tools for DeFi agents"
- "Safe wallet automation stack"
- "Research agent starter pack"
- "Best consumer AI agents on Base"

**Added value:** human editorial layer + aligned economic incentive. Good recommendations are rewarded. Bad ones are slashed. The incentive is perfectly aligned with registry quality.

---

### 6 — Curator Profiles

Knowing who curators are — their background, what they actually use, where their expertise is real — is what makes attestation weights meaningful. A stake from a DeFi expert on a trading tool is not the same signal as a stake from a generalist.

Curator profiles are built from two complementary sources: **active declaration at onboarding**, and **peer validation over time**. Neither alone is sufficient.

#### Onboarding — active declaration

When a user explicitly opts into becoming a curator, they declare:
- **Expertise domains** — DeFi, RAG, TypeScript, web scraping, computer use, research, etc.
- **Tools used in production today** — what they actually run, not just know about
- **Verifiable identity links** — ENS, Farcaster, GitHub (optional, boosts credibility score)
- **Self-assessed level per domain** — builder / expert / researcher

Every answer creates an on-chain Triple immediately. Nothing stored off-chain.

```
(curator, expert-in, "defi")           → declared Triple, low initial weight
(curator, uses-in-prod, "langchain")   → declared usage Triple
(curator, linked-to, "ens:alice.eth")  → identity anchor Triple
```

#### Peer validation — what makes claims credible

Declared claims carry low weight until validated by other curators. Anyone can `agree-with` or `dispute` a claim. The more a claim is validated by domain peers, the more it contributes to the curator's expertise score in that domain.

```
(curator2, agree-with, T_expert-in)   → validated, weight increases
(curator3, disputes, T_expert-in)     → contested, weight decreases
```

This is Sybil-resistant by design: validating a false claim costs Trust, and validators have their own reputation at stake.

#### Domain expertise score

```
domain_expertise(curator, category) =
    validated_claims_in_category
    × (agree_with_in_category / total_attestations_in_category)
    × recency_factor
```

This score feeds directly into the trust signal calculation, making attestation weight context-sensitive rather than flat.

#### What this looks like in practice

- **For users:** tool cards surface curator expertise — "recommended by 3 DeFi experts" carries different weight than "recommended by 12 builders"
- **For curators:** public profile shows declared domains, validation rate, stacks they actually run, and earnings history — proven, not claimed
- **For the agent:** attestation weight is dynamically adjusted by domain match, making recommendations sharper as the graph grows

---

## The Learning Flywheel

Every interaction makes the next one better. Wispr is not a static registry — it is a system that learns continuously from two interlocking loops, both running on Intuition.

### The user loop
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

Every query teaches the agent what the ecosystem actually needs. Every saved stack reveals which tool combinations work in practice. Every tool adoption confirms or challenges what curators predicted.

### The curator loop
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

A curator who consistently stakes on the right tools in their domain accumulates an expertise score that multiplies their future influence. The better their track record, the harder it is for newcomers to dilute the signal.

### How the two loops talk to each other

- **User queries inform curation priorities** — when many users ask for the same capability and no curator has staked in that domain, it creates a visible gap. Curators see demand before it's met.
- **Curator stakes feed agent recommendations** — the trust signal the agent reads is a direct function of who staked what. Better curators → better rankings → better blueprints.
- **Real adoption validates curator judgment** — when a tool staked by a curator gets widely adopted, their domain expertise score rises automatically. When it gets ignored, it doesn't.
- **The graph compounds** — each loop reinforces the other. More users → more usage signals → better curator validation → better rankings → more users. The system gets smarter with every transaction.

### What this means at scale

At launch, the agent recommends from a small, manually curated registry. Over time, as the graph accumulates queries, adoptions, stakes, validations and disputes, the recommendations become increasingly precise — not because the model changed, but because the trust graph it reads has become richer. The quality of the output is a direct function of the depth of the graph.

---

## Key Differentiators

**Anyone can submit — not everyone carries the same weight**
No gatekeeping at entry, but an economic mechanism that filters naturally. Quality emerges from the market, not from a central editorial team.

**Agent blueprint — not a list**
We don't say "here are some interesting tools." We say "here is exactly what to assemble, in what order, and why." Moving from discovery to composition.

**Wallet ≠ curator**
Connecting a wallet is a low-friction step for portability and identity. Becoming a curator is a deliberate, committed act — with a profile, a domain declaration, and Trust at stake. The distinction matters for trust weight.

**Curator expertise is declared and validated, not assumed**
Curators declare their domains at onboarding. Peers validate or dispute those claims on-chain. A DeFi expert's stake on a DeFi tool carries more weight than a generalist's — expertise is earned, not inferred from wallet activity.

**A system that learns with every transaction**
Every query, adoption, stake and validation enriches the on-chain graph. Recommendations get sharper over time — not because the model was retrained, but because the trust graph it reads grows more precise. The flywheel is the product.

**Portable cross-app reputation via Intuition**
A curator's reputation is not locked inside this product. It lives on-chain and is readable by any app in the Intuition graph. This is infrastructure, not a closed product.

**Invisible Web3 — maximum engagement**
The end user sees a text field and recommendations. The on-chain graph is passively enriched with every interaction. The product creates Web3 value without asking for Web3 effort.

**Nested triples for meta-reputation**
Not just attestations — attestations on attestations. A curator whose recommendations are consistently validated by others sees their weight multiplied. This is weighted reputation, not majority voting.

---

## 30-Second Pitch

"AI agents don't have an intelligence problem — they have a discovery, composition and trust problem. We're building the npm registry for AI agents, with a self-improving trust layer on top: every query, every adoption, every curator stake and peer validation enriches an on-chain graph that makes the next recommendation sharper. Curators put skin in the game, users get better blueprints over time, and the whole thing gets smarter with every transaction. Invisible to the end user. Verifiable on-chain."