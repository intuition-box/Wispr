# Wispr Project Vision

> **"Build agents, without building them."**

## The Problem

Building a performant AI agent today requires navigating a fragmented, opaque, and constantly evolving ecosystem. The tools exist. The collective knowledge does not.

**Concrete challenges:**
- Knowing the ecosystem of tools — MCPs, npm packages, SDKs — for each use case
- Choosing the right model based on task, budget, and expected latency
- Writing an effective system prompt that doesn't hallucinate or drift
- Iterating extensively before getting something reliable in production
- Repeating all of this for every new use case
- Never knowing if the tool you're using is truly the best available

**It's inaccessible to novices. It's time-consuming for experts.** And there's no collective trust layer on tool quality.

---

## The Vision

**Wispr** transforms an intention expressed in natural language into an operational agent, community-certified and ready to deploy in under a minute.

Wispr is a **decentralized registry of AI agent components** built on Intuition Protocol. Every tool, skill, and package has a verifiable reputation anchored on-chain, where community members stake their conviction on quality.

**The Web3 layer is not a gimmick.** It's the foundation of an open trust system, where every component has a traceable reputation, and where those who build that reputation are rewarded.

---

## 3-Layer Architecture

Three distinct layers, designed to work together. Each layer provides autonomous value and reinforces the other two.

### 🎨 Layer 1: Builder (UX/UI)

**The interface accessible to everyone. The user configures nothing — they describe their need.**

**Swipe Onboarding:**
- Tinder-style card deck (max 8 questions)
- Detects developer profile: role (Frontend, Backend, Web3, etc.) + AI maturity level
- No account needed, instant profiling

**Natural Language Input:**
- After profiling, user describes their need in plain English
- "I want an agent that monitors GitHub issues and summarizes them daily"
- AI analyzes profile + need to generate personalized recommendations

**Visual Stack Construction:**
- Animated blocks appear in real-time as AI decides
- Each block shows: tool name, trust score, active curators
- Live construction (not a static loader) = memorable first impression

**Dual Output:**
- **Export**: Copy-paste ready configs (system prompt, MCP setup, install commands)
- **Publish**: Save bundle on-chain as verifiable attestation

### ⛓️ Layer 2: On-Chain Registry (Data)

**The source of truth. All AI agent components registered as Intuition Protocol attestations.**

**Knowledge Graph Structure:**
- Every component (MCP server, npm package, LLM model, prompt template) = Intuition atom
- Relationships between components = Intuition triples
- Example: `(Filesystem MCP, compatible_with, Claude Sonnet 4.5)`

**Trust Scores:**
- Calculated from community stakes (deposited $TRUST tokens)
- Uses the "I" atom pattern: all users deposit on the same component = consolidated market signal
- TVL (total value locked) = quantified conviction
- Depositor count = adoption breadth

**Verifiable & Open:**
- Anyone can query the registry via public GraphQL endpoint
- All attestations immutably recorded on Intuition L3 chain
- Transparent history of who staked what, when

### 💰 Layer 3: Economic Curation (Incentives)

**Collective intelligence with skin-in-the-game. Good tools rise, bad ones fall.**

**Curator Flow:**
- Define expertise domains (TypeScript, RAG, Web scraping, etc.)
- Receive tool curation proposals matching their profile
- Stake $TRUST tokens on components they validate as quality
- Public curator profiles: reputation builds over time based on accuracy

**Incentive Alignment:**
- Curators earn proportionally to component adoption
- Early staking on rising tools = maximum returns
- Bad calls = opportunity cost (capital locked in low-adoption tools)
- Creates natural quality filter without central authority

**Market Dynamics:**
- Trust scores = live market signal (not static reviews)
- Capital-weighted conviction (whales and experts have proportional influence)
- Comparative markets: bullish vs bearish stances on competing tools

---

## Hackathon Scope (48h)

### What We're Building

**P0 - Core Demo:**
- ✅ Swipe onboarding (profile detection in <2 min)
- ✅ Natural language agent builder (chat interface)
- ✅ AI-powered stack generation (LLM recommends from registry)
- ✅ Animated block UI (real-time visual construction)
- ✅ Bundle export (copy-paste ready configs)
- ✅ Publish to Intuition (bundles as on-chain attestations)
- ✅ Trust score visualization (show staked amounts & curators)

**Simplified for Hackathon:**
- Registry = 10-15 pre-seeded components (we create before demo)
- Trust scores = mock stakes (real data structure, fake deposits)
- Curators = hardcoded profiles (concept demonstration)
- Read-only registry (users can't add new components in P0)

**What This Proves:**
- AI-powered agent matchmaking works
- On-chain attestations create verifiable trust layer
- Natural language → production config in <1 minute
- Community curation model is viable (shown via mock data)

---

## Value Propositions

### For Novice Users
- **Zero learning curve**: Describe need in plain English, get working agent config
- **Guided profiling**: 8 questions determine optimal setup
- **Instant export**: Copy-paste into Claude Desktop, Cursor, or any agent framework
- **Trust transparency**: See exactly which experts vouch for each tool

### For Advanced Users
- **Time savings**: Skip hours of research, get curated recommendations
- **Customization**: Edit generated configs, swap components manually
- **Discovery**: Browse entire registry with filters (type, reputation, domain)
- **Contribution**: Share your bundle configurations back to the community

### For Curators 
- **Monetize expertise**: Earn by validating quality tools in your domain
- **Reputation building**: Public track record of curation accuracy
- **Early-bird advantage**: Stake on rising tools before they're mainstream
- **Direct impact**: Shape the quality of the entire ecosystem

### For the Ecosystem
- **Quality assurance**: Market-driven filtering (not algorithmic black boxes)
- **Discoverability**: Best tools naturally rise through capital conviction
- **Interoperability**: Standardized component metadata enables composition
- **Verifiable trust**: On-chain attestations = portable reputation across platforms

---

## The "Wow Effect"

Utility is not enough. What stays in a user's memory is a precise moment. Here are our four wow moments.

### 1. Live Construction
The stack blocks animate and place themselves in the UI as the AI analyzes your need. Not a loading spinner. Not a static result. A **visible building process** that shows the AI thinking.

### 2. The Breathing Score
Trust scores aren't frozen stars. They **fluctuate in real-time** as curators stake and unstake. You see: "847 $TRUST staked by 23 curators" and watch it change. Living market signal, not dead review count.

### 3. Visible Skin in the Game
Click any tool to see who staked on it. Real wallet addresses. Real amounts. "0x1234...5678 staked 500 $TRUST." This isn't an algorithm recommending—it's **humans putting capital at risk** to vouch for quality.

### 4. Zero Setup, First Run
Email → swipe 8 questions → describe need → agent config ready. **No API keys. No repo cloning. No prompt engineering.** The wow happens in the first 60 seconds.

---

## Pitch (30 seconds)

> **"We're building the decentralized registry for AI agent components using Intuition Protocol."**
>
> **The problem:** No trust layer for AI tools. You don't know which MCP servers, packages, or prompts are quality.
>
> **Our solution:** Community-curated attestations with skin-in-the-game stakes, anchored on-chain.
>
> **What we built in 48h:**
> - AI-powered agent builder with natural language input
> - Bundles published as verifiable attestations on Intuition
> - Trust scores visualization (showing future staking economics)
> - One-click export to production-ready configs
>
> **Post-hackathon:** Real staking mechanism, curator rewards, portable ENS identity.

---

## Open Questions

1. **Monetization**: What economic model for the platform?
   - Subscription for premium access?
   - Fees on staking transactions?
   - Marketplace with commissions?
   - Grant-funded public good?

2. **Registry Governance**: Who can add components post-hackathon?
   - Open submission with curator approval?
   - Minimum stake requirement to propose?
   - Reputation threshold for auto-approval?

3. **Cross-Chain Strategy**: Should bundles be portable across chains?
   - Intuition L3 as source of truth, mirror to Base/Optimism?
   - Multi-chain attestations with unified trust scores?
   - Single-chain for simplicity?

4. **LLM Provider**: Which model for need analysis?
   - OpenAI GPT-4 (reliable, expensive)
   - Anthropic Claude (good at analysis, API cost)
   - Open-source fine-tuned model (control, upfront cost)
   - Ensemble approach (multiple models vote)?

5. **Curator Incentives**: How to bootstrap before real stakes?
   - Retroactive rewards for early curators?
   - Initial airdrop to experts who seed registry?
   - Team-operated curators until critical mass?

6. **Agent Hosting**: Infrastructure for post-hackathon hosting?
   - Partnership with compute providers (Akash, Render)?
   - Self-hosted by default (we just generate configs)?
   - Hybrid (optional hosted tier for non-technical users)?
