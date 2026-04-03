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

**Wispr** transforms an intention expressed in natural language into an operational agent, community-certified and hostable in less than a minute.

Wispr is a **curated on-chain knowledge graph**, coupled with an AI builder, coupled with economic incentives so the community maintains graph quality permanently.

**The Web3 layer is not a gimmick.** It's the foundation of an open trust system, where every tool, every package, every skill has a traceable reputation, and where those who build that reputation are rewarded.

---

## 3-Layer Architecture

Three distinct layers, designed to work together. Each layer provides autonomous value and reinforces the other two.

### 🎨 Layer 1: Builder (UX/UI)

**The interface accessible to everyone. The user configures nothing — they describe their need.**

- Email login → embedded wallet created silently (invisible to novices)
- Natural language chat: user describes their need or use case
- An LLM analyzes the request and generates an optimized meta-prompt
- The UI displays a recommended stack: visual blocks (tools, skills, MCPs, model)
- Each block displays its trust score and active curators
- Two outputs: inject the prompt elsewhere, or host the agent directly on Wispr

### ⛓️ Layer 2: On-Chain Registry (Data)

**The source of truth. All objects consumable by an agent, written on Intuition Protocol.**

- Each object (tool, skill, MCP, package, model, prompt) is an Intuition atom
- Structured metadata: URL, description, usage context, compatibility
- Trust score calculated from curator stakes (atoms/triples)
- The Builder only recommends objects indexed and active in the Registry
- Open: anyone can propose an object, curation filters quality

### 💰 Layer 3: Economic Curation (Incentives)

**Collective intelligence with real incentives. Good tools rise, bad ones fall.**

- Curators define their area of expertise (TypeScript, RAG, Web scraping…)
- They receive proposals for objects to curate in their domain
- They stake TRUST tokens on objects they judge to be quality
- Rewarded proportionally to adoption: the more an object is used, the more they earn
- Dashboard: profile, domains, active stakes, earnings history, trust score
- Early-bird incentive: staking early on a rising object = maximum return

---

## Value Propositions

### For Novice Users
- **Simplified login**: Web2 authentication (email) with automatic embedded wallet creation
- **Intuitive interface**: Visual tool blocks with visual interaction
- **Intelligent guidance**: LLM that analyzes needs and proposes the best configuration
- **Zero configuration**: Pre-configured packages for common use cases
- **Managed hosting**: Ability to host created agents

### For Advanced Users
- **Advanced customization**: Meta-prompts injectable anywhere
- **Complete catalog**: Access to all objects (packages, skills, MCPs) with detailed documentation
- **Transparency**: URLs, utility, context and reputation for each tool
- **Total control**: Manual component selection if desired

### For Curators
- **Monetization of expertise**: Earn tokens by curating
- **Personalized dashboard**: Profile adapted to areas of expertise
- **Reputation system**: Staking on good tools = proportional gains
- **Direct impact**: Improve overall platform quality

### For the Ecosystem
- **Quality assurance**: Reputation system based on staking and real usage
- **Discoverability**: The best tools naturally emerge
- **Standards**: Centralized registry of objects needed for agents
- **Web3 certification**: Traceability and authenticity of validated tools

---

## User Flows

### Flow 1: Novice User - Agent Creation

```
1. Connection
   └─> Email (Web2)
   └─> Automatic embedded wallet creation

2. Need expression
   └─> Chat interface
   └─> Natural language task description

3. Intelligent analysis
   └─> LLM analyzes the request
   └─> Optimal configuration generation:
       ├─> Recommended skills
       ├─> Appropriate packages
       ├─> Most accurate model
       └─> Generated meta-prompt

4. Configuration visualization
   └─> Visual block interface
   └─> Each block represents a tool/skill/package
   └─> Displayed information:
       ├─> Name and description
       ├─> Reputation score
       ├─> Usage context
       └─> Documentation URL

5. Validation and deployment
   └─> Optional adjustments via interface
   └─> Agent hosting option
   └─> Launch and use
```

### Flow 2: Advanced User - Advanced Customization

```
1. Connection
   └─> Same process (Email + embedded wallet)

2. Catalog exploration
   └─> Access to complete registry
   └─> Filters by:
       ├─> Type (skill, package, MCP, model)
       ├─> Reputation
       ├─> Domain/category
       └─> Version

3. Manual construction
   └─> Selection of desired components
   └─> Meta-prompt editing
   └─> Fine parameter configuration

4. Injection and testing
   └─> Inject prompt where desired
   └─> Testing and iterations
   └─> Configuration save

5. Sharing (optional)
   └─> Publish configuration as package
   └─> Contribute to ecosystem
```

### Flow 3: Curator - Tool Validation

```
1. Curator onboarding
   └─> Profile creation
   └─> Expertise domain definition:
       ├─> Technical stack
       ├─> Agent types
       └─> Business domains

2. Personalized dashboard
   └─> Curation suggestions based on profile
   └─> New tools to validate in expertise domains
   └─> Performance metrics of already staked tools

3. Curation process
   └─> Spend subscription tokens
   └─> Tool analysis:
       ├─> Functional testing
       ├─> Documentation review
       ├─> Compatibility verification
       └─> Quality evaluation

4. Staking and certification
   └─> Staking decision (amount)
   └─> Metadata addition:
       ├─> Usage context
       ├─> Recommended use cases
       ├─> Notes and warnings
       └─> Tags and categorization

5. Gains and reputation
   └─> Gains proportional to:
       ├─> Tool usage
       ├─> Tool reputation score
       └─> Staked amount
   └─> Build personal reputation as curator
```

---

## The "Wow Effect"

Utility is not enough. What stays in a user's memory is a precise moment. Here are the four candidate moments.

### 1. Live Construction
The stack blocks animate and place themselves in the UI as the LLM analyzes. Not a loader. A visible construction in real-time.

### 2. The Breathing Score
The trust score isn't a frozen star. It fluctuates. You see in quasi-real-time how many tokens are staked on each tool and by whom.

### 3. Visible Skin in the Game
Each curator's profile is public. "Jean-Baptiste, TypeScript expert, 847 TRUST." This isn't an algorithm — it's a human who put their reputation on the line.

### 4. Zero Setup, First Run
Email → agent running. No API keys to configure, no repo to clone, no prompt to write. The wow from the first use.

---

## Open Questions

1. **Monetization**: What economic model for the platform?
   - Subscription for premium access?
   - Fees on staking transactions?
   - Marketplace with commissions?

2. **Hosting**: Infrastructure to host agents?
   - Cloud partnerships?
   - Decentralized (on-chain compute)?
   - Hybrid?

3. **Analysis LLM**: Which model for needs analysis?
   - Proprietary fine-tuned model?
   - Ensemble of models?
   - Multi-agent pipeline?

4. **Wow Effect**: How to create the wow effect from onboarding?
   - Immediate interactive demo?
   - Impressive results on popular use cases?
   - Ultra-fast execution speed?
   - Spectacular visual interface?

5. **Registry Bootstrap**: How to bootstrap the Registry before having curators?
   - Centralized curation phase by core team?
   - Initial seed with most popular packages?
   - Partnerships with experts for initial curation?


