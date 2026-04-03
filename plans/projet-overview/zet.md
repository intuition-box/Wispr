# Project Overview — Zet

## Vision

The web3 community is approaching agentic reputation the wrong way. Current approaches (8004, ACP, etc.) focus on an agent's reputation — but that solves nothing. An agent is just a name slapped on a set of highly volatile components: skills, LLMs, MCP servers, APIs, libraries, etc.

Even if an agent's reputation could be relevant at a given moment, it won't hold tomorrow when its components change. It's the **reputation of individual components** that matters.

## Goals
<!-- What are the main goals for this hackathon? -->

## Value Proposition

**Wispr** is a recommendation engine for agentic components. It matchmakes the best components to use in a given context. Instead of evaluating an agent as a whole, Wispr evaluates and recommends each building block: which LLM, which MCP server, which API, which skill to use for a specific use case.

## How It Works

A **permissionless knowledge graph** (Intuition Protocol) on which experienced agentic users publish their component preferences based on context.

Examples of published preferences:
- "For video generation → Remotion skill"
- "For web3 → EthSkill"
- "For SVGs → Gemini 3.1 Pro"

These contextual preferences feed the knowledge graph. Wispr then aggregates these signals to recommend the best components for the user's context.

## Personas

### 1. Curators — experienced agentic users
- **Role**: publish the components they use across their various AI workflows onto the knowledge graph
- **Motivation**: immediate value — they build their own portable knowledge subgraph, on-chain. It's their decentralized agentic skills profile.

### 2. AI Novices — users without configuration
- **Role**: don't have AI components configured or established preferences
- **Usage**: express an intent to Wispr ("I want to build X"), Wispr returns a list of recommended components so they can configure their local environment (Claude, Caudex, etc.) with the right tools

## Project Components

### 1. Novice App — "Wispr Chat"
- **Home screen**: an AI chatbox
- The user expresses their intent in natural language (e.g., "I want to build a web platform for sharing cooking recipes")
- The Wispr agent responds with a recommended component preset, delivered as 2 outcomes:
  - **Visual gallery** of components to use (clear overview of each building block)
  - **One-shot prompt** to install these components in a single command in their local environment

### 2. Wispr Agent (standalone component)
- Receives the novice user's intent
- **Extracts semantic claims** from that intent (e.g., "web platform" → web domain, "recipes" → content, "sharing" → social)
- **Queries the Intuition knowledge graph** with these claims to surface the top recommended components for that context
- Returns results to the novice app

### 3. Wispr Skill / MCP — direct access from your LLM
- Equivalent of skills.sh (Vercel Labs) but for Wispr
- Lets you query component recommendations directly from your LLM environment (Claude, etc.) without going through the novice app
- Same Wispr agent on the backend, but exposed as an installable skill/MCP

### 4. Wispr Feedback API
- Collects feedback throughout the course of a project (called by the Wispr skill during usage)
- No web3 transaction required — accessible to everyone (web2 and web3)
- **Free to consult for curators**: they can use it to broaden or reassess their component recommendations
- Closes the feedback loop: intent → recommendation → real usage → feedback → better curation

### 5. Initial Ontology & Dataset
- Definition of the knowledge graph ontology (component categories, context types, relations)
- Seed data for the hackathon: an initial dataset of components and preferences so the graph isn't empty at launch

### 6. Curator App — "Wispr Onboarding"
- **Tinder-style UX** (yes/no, swipe) to quickly profile the curator:
  - Domain expertise (web, design, project management, etc.)
  - AI expertise level
- Once the profile is established → ask them to **curate their preferred components** by topic/subcategory related to their expertise

## Intuition Protocol Integration

Intuition Protocol **is** the knowledge graph. It's the foundational data layer of the project: user preferences (component X for context Y) are stored as on-chain triples on Intuition. The protocol provides the permissionless structure and signal credibility.

## Priorities
<!-- What's most important to deliver during the hackathon? -->

## Risks & Open Questions
<!-- Uncertainties, identified risks, questions for the team -->
