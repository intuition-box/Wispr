# Wispr

> Swipe to build your perfect AI agent stack.

---

## Vision

Wispr identifies your developer profile in under 2 minutes through an Akinator-style swipe onboarding, then generates a ready-to-use agent bundle — system prompt, MCP config, LLMs, and packages — tailored to who you are. Bundles are anchored on-chain via Intuition Protocol and tied to an ENS identity. Builders can compare and battle their setups against each other.

---

## Partners

| Partner | Usage |
|---|---|
| **Intuition Protocol** | Bundle anchored on-chain as verifiable attestations |
| **ENS** | Agent portable identity — `{name}.wispr.eth` |
| **0G** | Decentralized config storage + compute |
| **Reown** | Multi-chain wallet connection |

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

Output: `Profile { role, level }` → stored in Zustand.

---

### 2. Explorer `/explorer`

Product catalogue filtered by detected profile. Same UX pattern as the EthCC agenda app.

- Products recommended for the profile appear first, highlighted
- Filter bar: All / LLM / MCP / Package / API / Tool
- Each card: name · description · type · price · Add/Remove
- FAB: cart count → `/bundle`

---

### 3. Bundle `/bundle`

Auto-generated from profile + cart selections.

- **System Prompt** — editable textarea, one-click copy
- **MCP Config** — toggleable servers, generates `claude_desktop_config.json`, one-click copy
- **Packages** — install command, one-click copy
- **LLMs** — recommended models with reasoning
- **Publish on-chain** — Intuition triples + ENS subname (P1)
- **Battle** → `/battle` — compare bundle against another builder's

---

### 4. Battle `/battle`

- Input: wallet address or ENS of the challenger
- Split view: my bundle vs theirs
- Shared tools highlighted
- Compatibility score: X tools in common
- Shareable URL

---

## Tech Stack

```
React 19 + TypeScript + Vite
react-router-dom v7
Framer Motion        → swipe animations
Zustand              → global state (persisted)
ethers.js v6         → wallet + Intuition (P1)
CSS vanilla          → Botly dark theme
```

---

## Scope

**P0 — Hackathon demo**
- Swipe onboarding
- Explorer + cart
- Bundle generation (mock)

**P1 — On-chain**
- Wallet connect (Reown)
- Publish bundle → Intuition triples
- ENS subname
- Battle via on-chain profile fetch