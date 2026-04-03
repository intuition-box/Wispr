# Wispr Project Vision — Maxime

> **"Collective intelligence whispered to AI before it responds."**

---

## The Problem

LLMs don't know what **really works** — not in your context, not with your stack, not in 2025.

**Three fundamental issues:**

1. **Frozen knowledge**: Models don't know deprecated APIs, new standards, or production conflicts
2. **Missing context**: "Which auth?" depends on serverless vs monolith, team vs solo
3. **Lost experience**: Developers solve same problems daily, knowledge disappears

**Result**: Fragmented ecosystem, no trust layer, no collective memory.

---

## The Vision

**Wispr** is where developers' collective intelligence becomes the context for AI responses.

Before generating, Wispr queries a **living knowledge graph** — built by practitioners who've shipped. The AI receives **pre-resolved context**: which components work, validated by real humans on-chain.

**Not a chatbot with a better prompt.** A new paradigm — AI learns through community attestation, not training.

---

## Pre-Resolved Context (Core Innovation)

**The difference:**
- **Standard LLM**: Lists 10 auth options → User decides → Decision paralysis
- **Wispr**: Graph queries first → Returns top-rated (Clerk 9.1/10, 23 attestations) → LLM executes directly

**No exploration phase. Pre-decided by community, contextualized for your stack.**

---

## User Experience

### Step 1: Describe Need
```
"Build a Next.js agent that monitors GitHub issues"
```
No setup. No API keys.

### Step 2: Wispr Queries Graph
Behind the scenes: Intent parsed → Graph query → Top components (contextualized) → Pre-resolved context → AI executes

### Step 3: Receive Agent Blueprint

**Not just code — an executable plan:**

**Visual Gallery**: Component cards showing GitHub MCP (9.1/10, 23 votes), Vercel AI SDK (8.9/10, 31 votes), Next.js Cron (9.0/10, 18 votes)

**Blueprint includes:**
- **Components**: Which tools (GitHub MCP, Vercel AI SDK)
- **Order**: How to assemble (orchestrator → tools → scheduler)
- **Why**: Justification ("validated for Next.js contexts by 23 experts")
- **Risk**: Permissions, autonomy level

**Two outputs:**
1. **Working code** — Ready to run
2. **Exportable configs** — Copy-paste to Claude, Cursor


### Step 5: Usage & Feedback

**Feedback Loop** (closes the cycle):
1. User builds with recommended components
2. Wispr collects usage feedback (web2-friendly, no wallet)
3. Aggregated weekly → On-chain attestation updates
4. Curators see real production data in dashboard
5. Adjust attestations based on reality

**Closes loop**: attestation → usage → feedback → better attestation

### Step 6: If Unsatisfied

"Contribute to Wispr" → Become curator

---

## Becoming a Curator

### Swipe Profiling (6-8 questions)

**Tinder-style onboarding:** Binary questions ("Do you work with code?" → "Frontend or backend?" → "Use React?" → "Familiar with Next.js?")

**Result**: On-chain profile with expertise tags: `[nextjs, react, typescript, frontend]`

### Dashboard

Curators see:
- Components in their domains (Next.js tools)
- Real usage feedback from production
- Peer validations/disputes

### What Curators Do

**Contextualized attestations:** Not just "GitHub MCP is good (9/10)", but "GitHub MCP for Next.js (9/10)" vs "for Python (6/10)"

**Rate on:**
- **Relevance**: Solves the problem?
- **Developer Experience**: Pleasant to use?
- **Reliability**: Works in production?

**Meta-reputation (P1):** Peers validate/dispute your attestations → Weight increases/decreases → Self-regulating system

---

## The Living Graph

### Structure

**1. Components** (Tools/MCPs/Libraries):
- GitHub MCP, Clerk, Claude Sonnet, Vercel AI SDK, etc.

**2. Contexts** (Domains/Use Cases):
- `web3-building`: Smart contracts, dApps, wallets
- `ai-agents`: LLM orchestration, RAG, MCP integration
- `event-planning`: Scheduling, booking, notifications
- `data-pipelines`: ETL, analytics, streaming
- `frontend`: React, Next.js, UI components
- `backend`: APIs, databases, auth

**3. Attestations** (Contextualized ratings):
- `(curator, rates, GitHub-MCP, in-context: "ai-agents") → 9.1/10`
- `(curator, rates, Clerk, in-context: "frontend") → 8.8/10`

**4. Meta** (Peer validation):
- Peers validate/dispute attestations (nested triples)

**5. Feedback** (Real usage):
- Production data from actual deployments

### Reputation

**P0 (Hackathon)**: Simple average
```
reputation = Σ scores / attestations

```

**Domain expertise matters:**
- DeFi expert stakes on DeFi tool > generalist stakes
- Calculated from validated claims + peer validation

### Why On-Chain?

- **Verifiable**: Anyone can audit
- **Permanent**: Can't be deleted/manipulated
- **Portable**: Reputation travels across apps (Intuition ecosystem)
- **Transparent**: See who vouched, when, how much

Built on **Intuition Protocol** (L3 chain).

---

## What Makes This Unique

### 1. Pre-Resolved Context ✨
Graph decides **before** LLM generates → Execution, not exploration

### 2. Agent Blueprint ✨
Not just code, but **complete plan**: components + order + why + cost + risk

### 3. Visual Gallery + Animated Blocks ✨
- Gallery shows stack as cards
- Advanced mode: cards appear animated in real-time
- Educational: see AI decision process

### 4. Feedback Loop ✨
Real usage data feeds back to curators → Data-driven curation

### 5. Nested Triples ✨
Attestations on attestations → Meta-reputation, self-regulating


---

## Hackathon Scope (48h)

**Core**:
- Chat interface (plain English)
- Pre-resolved context (graph decides before LLM)
- Visual gallery (component cards)
- Agent blueprint generation
- Code + config export
- Curator swipe onboarding
- Simple attestation dashboard

**Demo Features**:
- Animated blocks (switchable)
- Trust scores visible
- Feedback collection (off-chain for P0)

**Simplified**:
- Pre-seeded graph (10-15 components)
- Social curation (no staking)
- Single context (Next.js + AI)
- Simple average reputation


---

## Why This Matters

**For Developers**:
- Validated answers from people who've shipped
- Blueprint (not just code) = understand the stack
- Skip hours of research

**For Curators**:
- Shape what AI recommends
- Build portable reputation (Intuition ecosystem)
- Earn rewards (P1)
- See real usage data

**For AI**:
- Operational knowledge, continuously updated
- Context-aware (Next.js ≠ Python)
- Not frozen training data

**For Web3**:
- On-chain attestations create real value
- Portable reputation across apps
- Beyond speculation

---

## Pitch (30 seconds)

> **"Collective intelligence for AI — pre-resolved, visual, validated."**
>
> **Problem**: LLMs hallucinate about tools. No context. No trust.
>
> **Solution**: Living knowledge graph. AI queries **before** generating. Pre-resolved context = direct execution.
>
> **Unique**:
> - Visual gallery + animated blocks
> - Agent blueprints (not just code)
> - Feedback loop (usage → curation)
> - Nested triples (meta-reputation)
>
> **Demo**: 60 seconds to executable agent plan, validated by domain experts, on-chain.

