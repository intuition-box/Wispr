# Project Overview — Zet

## Vision

The web3 community is approaching agentic reputation the wrong way. Current approaches (8004, ACP, etc.) focus on an agent's reputation — but that solves nothing. An agent is just a name slapped on a set of highly volatile components: skills, LLMs, MCP servers, APIs, libraries, etc.

Even if an agent's reputation could be relevant at a given moment, it won't hold tomorrow when its components change. It's the **reputation of individual components** that matters.

## Goals
<!-- What are the main goals for this hackathon? -->

## Partners

| Partner | Usage |
|---|---|
| **Intuition Protocol** | Knowledge graph + on-chain attestations + recommendation via MCP (TVL-based) |
| **ENS** | Portable identity — `{name}.wispear.eth` |
| **0G** | Decentralized LLM database — source for recommending specific LLMs as components |
| **Reown** | Multi-chain wallet connection |

## Value Proposition

**Wispear** is a recommendation engine for agentic components. It matchmakes the best components to use in a given context. Instead of evaluating an agent as a whole, Wispear evaluates and recommends each building block: which LLM, which MCP server, which API, which skill to use for a specific use case.

## How It Works

A **permissionless knowledge graph** (Intuition Protocol) on which experienced agentic users publish their component preferences based on context.

Examples of published preferences:
- "For video generation → Remotion skill"
- "For web3 → EthSkill"
- "For SVGs → Gemini 3.1 Pro"

These contextual preferences feed the knowledge graph. Wispear then aggregates these signals to recommend the best components for the user's context.

## Personas

### 1. Curators — experienced agentic users
- **Role**: publish the components they use across their various AI workflows onto the knowledge graph
- **Motivation**: immediate value — they build their own portable knowledge subgraph, on-chain. It's their decentralized agentic skills profile.

### 2. AI Novices — users without configuration
- **Role**: don't have AI components configured or established preferences
- **Usage**: express an intent to Wispear ("I want to build X"), Wispear returns a list of recommended components so they can configure their local environment (Claude, Caudex, etc.) with the right tools

## Project Components

### 1. Novice App — "Wispear Chat"
- **Home screen**: an AI chatbox
- The user expresses their intent in natural language (e.g., "I want to build a web platform for sharing cooking recipes")
- The Wispear agent responds with a recommended component preset, delivered as 2 outcomes:
  - **Animated visual gallery** — component blocks build up in real-time as the AI decides (not a static list, a visible construction process). Trust scores "breathe" (fluctuate live as curators stake/unstake). Click any component to see who staked and how much — visible skin in the game.
  - **One-shot prompt** to install these components in a single command in their local environment
- **CTA "Contribute to Wispear"** — if the user is unsatisfied with results, they're invited to become a curator. The novice app doubles as an entry point for the curator persona

### 2. Wispear Agent (standalone component)
- Receives the novice user's intent
- **Extracts semantic claims** from that intent (e.g., "web platform" → web domain, "recipes" → content, "sharing" → social)
- **Queries the Intuition knowledge graph** with these claims to surface the top recommended components for that context
- Returns results to the novice app

### 3. Wispear Skill — dynamic component loader for LLMs
- Equivalent of `find-skill` (skills.sh / Vercel Labs) but powered by Wispear's knowledge graph
- Allows an LLM to **dynamically load the right skills and resources based on context** — no manual configuration needed
- The LLM asks Wispear Skill what it needs, Wispear queries the graph and returns the best components to load on the fly

### 4. Wispear Feedback API
- Collects feedback throughout the course of a project (called by the Wispear skill during usage)
- No web3 transaction required — accessible to everyone (web2 and web3)
- **Free to consult for curators**: they can use it to broaden or reassess their component recommendations
- Closes the feedback loop: intent → recommendation → real usage → feedback → better curation

### 5. Initial Ontology & Dataset
- Definition of the knowledge graph ontology (component categories, context types, relations)
- Seed data for the hackathon: an initial dataset of components and preferences so the graph isn't empty at launch

### 6. Curator App — "Wispear Onboarding"
- **Tinder-style UX** (yes/no, swipe) to quickly profile the curator:
  - Domain expertise (web, design, project management, etc.)
  - AI expertise level
- Once the profile is established → ask them to **curate their preferred components** by topic/subcategory related to their expertise
- **Battle / Bundle Comparison**: curators can compare their bundle against another builder's (split view, shared tools highlighted, compatibility score, shareable URL)

## Intuition Protocol Integration

Intuition Protocol **is** the knowledge graph. It's the foundational data layer of the project: user preferences (component X for context Y) are stored as on-chain triples on Intuition. The protocol provides the permissionless structure and signal credibility.

**Recommendation engine is fully delegated to Intuition's MCP**, which relies on TVL (Total Value Locked) as the ranking signal. The more curators stake on a component for a given context, the higher it ranks.

**Economics are handled by Intuition Protocol natively:**
- Curators stake $TRUST tokens on components they vouch for
- TVL per component per context = the reputation signal
- Bonding curves, early staking rewards, quality filtering — all built into Intuition


## Priorities

**P0 — Hackathon Demo:**
- Swipe onboarding (curator profiling)
- Chat interface (novice intent → recommendations)
- Wispear Agent (semantic claim extraction + Intuition graph query)
- Animated visual gallery of recommended components
- One-shot install prompt export
- Curator CTA from novice app
- Initial ontology + seed data
- On-chain attestations via Intuition

**P1 — Post-hackathon:**
- Wispear Skill for direct LLM access
- Battle feature
- ENS identity (`{name}.wispear.eth`)
- $TRUST staking mechanics
- Feedback API

## Risks & Open Questions
<!-- Uncertainties, identified risks, questions for the team -->
