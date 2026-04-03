# AgentMatch — PRD Front (100% Mock)

> Swipe onboarding + explorer catalogue + bundle recap. Zéro backend, zéro wallet, données hardcodées.

---

## Init

```bash
bun create vite agentmatch --template react-ts
cd agentmatch
bun add framer-motion react-router-dom zustand
```

---

## Stack

```
React 19 + TypeScript + Vite
react-router-dom v7
Framer Motion        → swipe cards
Zustand              → state global
CSS vanilla          → thème Botly
```

---

## Routes

```
/swipe      → SwipePage (onboarding)
/explorer   → ExplorerPage (catalogue)
/bundle     → BundlePage (recap + bundle)
```

Redirect `/` → `/swipe`

---

## Structure

```
src/
├── main.tsx
├── types/index.ts
├── data/
│   └── products.ts          # mock ~30 produits
├── lib/
│   ├── questions.ts         # arbre adaptatif
│   └── engine.ts            # résolution profil + filtrage
├── store/
│   └── store.ts             # Zustand
├── components/
│   ├── swipe/
│   │   ├── SwipeCard.tsx
│   │   └── SwipeDeck.tsx
│   ├── product/
│   │   └── ProductCard.tsx
│   ├── bundle/
│   │   ├── PromptBlock.tsx
│   │   └── McpBlock.tsx
│   └── ui/
│       └── ProgressBar.tsx
├── pages/
│   ├── SwipePage.tsx
│   ├── ExplorerPage.tsx
│   └── BundlePage.tsx
└── styles/
    ├── globals.css
    ├── swipe.css
    ├── explorer.css
    └── bundle.css
```

---

## SwipePage

**Comportement :**
- Max 8 questions, adaptatives (la suivante dépend de la réponse)
- Swipe right = Like ✅ / Swipe left = Dislike ❌
- Boutons en bas en fallback (mobile)
- ProgressBar en haut
- Quand profil résolu → `navigate("/explorer")`

**SwipeCard (Framer Motion) :**
```tsx
// Drag horizontal
// onDragEnd : si x > 100 → like, si x < -100 → dislike
// Rotation légère pendant le drag
// Stack effect : 3 cartes visibles, scale décroissant derrière
// Texte de la question centré sur la carte
```

**Questions (arbre adaptatif) :**

```
q_blockchain → like → q_frontend
              dislike → q_figma

q_frontend   → like → ROLE:fullstack_web3
              dislike → ROLE:smart_contract

q_figma      → like → ROLE:designer
              dislike → q_define

q_define     → like → q_devteam
              dislike → q_backend

q_devteam    → like → ROLE:product_manager
              dislike → ROLE:founder

q_backend    → like → ROLE:backend_dev
              dislike → ROLE:frontend_dev

--- rôle résolu, on enchaîne sur la maturité ---

q_actions    → like → q_local
              dislike → LEVEL:beginner

q_local      → like → q_mcp
              dislike → LEVEL:intermediate

q_mcp        → like → q_multiagent
              dislike → LEVEL:advanced

q_multiagent → like → LEVEL:expert
              dislike → LEVEL:advanced
```

---

## ExplorerPage

**Inspiré de l'agenda EthCC.** Même pattern : grille de cards, toolbar de filtres.

**Layout :**
```
[Header : profil détecté — badge rôle + niveau]
[Toolbar : All | LLM | MCP | Package | API | Tool]
[Grille de ProductCards]
[FAB panier : X produits → /bundle]
```

**ProductCard :**
```
- Nom + icône type (LLM 🤖 / MCP 🔌 / Package 📦 / API ⚡)
- Description courte (1 ligne)
- Badge prix (Free / Paid / Freemium)
- Bouton "Add" / "Remove" (toggle)
- Highlight si recommandé pour le profil détecté
```

**Filtres :**
- Par type (All / LLM / MCP / Package / API / Tool)
- Les produits recommandés pour le profil apparaissent en premier

**Mock produits (~30) :**

```typescript
// LLMs
{ id: "claude-sonnet", name: "Claude Sonnet 4", type: "llm", price: "paid", roles: [...], levels: [...] }
{ id: "claude-opus", name: "Claude Opus 4", type: "llm", price: "paid", roles: [...], levels: ["expert"] }
{ id: "cursor", name: "Cursor", type: "tool", price: "freemium", ... }
{ id: "chatgpt", name: "ChatGPT", type: "llm", price: "freemium", ... }

// MCP Servers
{ id: "mcp-github", name: "GitHub MCP", type: "mcp", price: "free", ... }
{ id: "mcp-filesystem", name: "Filesystem MCP", type: "mcp", price: "free", ... }
{ id: "mcp-foundry", name: "Foundry MCP", type: "mcp", price: "free", ... }
{ id: "mcp-alchemy", name: "Alchemy MCP", type: "mcp", price: "freemium", ... }
{ id: "mcp-notion", name: "Notion MCP", type: "mcp", price: "free", ... }
{ id: "mcp-linear", name: "Linear MCP", type: "mcp", price: "free", ... }
{ id: "mcp-brave", name: "Brave Search MCP", type: "mcp", price: "free", ... }

// Packages
{ id: "pkg-viem", name: "viem", type: "package", price: "free", ... }
{ id: "pkg-wagmi", name: "wagmi", type: "package", price: "free", ... }
{ id: "pkg-anthropic", name: "@anthropic-ai/sdk", type: "package", price: "free", ... }
{ id: "pkg-elizaos", name: "@elizaos/core", type: "package", price: "free", ... }
{ id: "pkg-hardhat", name: "hardhat", type: "package", price: "free", ... }
{ id: "pkg-langgraph", name: "langgraph", type: "package", price: "free", ... }
{ id: "pkg-zod", name: "zod", type: "package", price: "free", ... }

// APIs
{ id: "api-alchemy", name: "Alchemy", type: "api", price: "freemium", ... }
{ id: "api-thegraph", name: "The Graph", type: "api", price: "freemium", ... }
{ id: "api-intuition", name: "Intuition API", type: "api", price: "free", ... }
{ id: "api-openai", name: "OpenAI API", type: "api", price: "paid", ... }
```

---

## BundlePage

**Layout :**
```
[Header : profil + "Your Agent Bundle"]

[PromptBlock]
  → System prompt généré selon profil (mock hardcodé par profil)
  → Textarea éditable
  → Bouton "Copy"

[McpBlock]
  → Liste des MCP servers ajoutés au panier
  → Toggle ON/OFF par server
  → JSON claude_desktop_config généré dynamiquement
  → Bouton "Copy config"

[PackagesBlock]
  → Liste des packages ajoutés
  → Commande install : "npm install x y z"
  → Bouton "Copy"

[LlmBlock]
  → LLMs ajoutés + celui recommandé par défaut

[Footer]
  → Bouton "Start over" → reset + /swipe
  → Bouton "Share" → copy URL (mock)
```

**System prompts mock (8 profils clés) :**

```typescript
"smart_contract:expert":
  "You are an expert Solidity engineer at a Web3 hackathon. Prioritize gas optimization and security. Flag reentrancy and access control issues first. Be concise — assume deep EVM knowledge."

"fullstack_web3:advanced":
  "You are a senior Web3 full stack engineer. Help me build across smart contracts, APIs, and React frontends. Flag security issues, make pragmatic decisions. I know viem, wagmi, and ethers."

"frontend_dev:intermediate":
  "You are a Web3 frontend developer. Focus on wallet integration and clean UX for blockchain interactions. Suggest viem and wagmi patterns. Keep code readable."

"backend_dev:advanced":
  "You are a Web3 backend engineer. Help me build APIs, indexers, and off-chain infrastructure. Design robust systems and interface with on-chain data efficiently."

"product_manager:beginner":
  "You are a Web3 product assistant. Help me write PRDs and user stories. Always ask about the user problem first. Translate blockchain concepts into plain language."

"founder:intermediate":
  "You are a strategic advisor for a Web3 hackathon founder. Help me scope the MVP and align with prize tracks. Be direct. Flag over-engineering."

"designer:beginner":
  "You are a Web3 UX/UI design assistant. Help me design intuitive interfaces for blockchain interactions. Focus on reducing wallet friction and making on-chain actions clear."

"smart_contract:intermediate":
  "You are a Solidity developer. Help me write secure smart contracts and suggest tests alongside implementation. Flag security issues clearly."
```

---

## Zustand Store

```typescript
type Store = {
  answers: Answer[]
  profile: Profile | null
  cart: string[]               // product IDs

  answer: (questionId: string, value: "like" | "dislike") => void
  toggleCart: (productId: string) => void
  reset: () => void
}
```

Persisté dans `localStorage` (`zustand/middleware persist`).

---

## Design — Botly Theme

Dark. Tokens CSS à extraire du fichier Figma avant de coder les composants.

```css
:root {
  --bg-primary: #0f1117;
  --bg-card: #1a1d27;
  --bg-card-hover: #1f2335;
  --accent: #6366f1;          /* à ajuster selon Botly */
  --accent-soft: #6366f120;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border: #2d3148;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --success: #22c55e;
  --warning: #f59e0b;
}
```

---

## Ordre de build pour Claude Code

```
1. types/index.ts
2. data/products.ts          (30 produits mock)
3. lib/questions.ts
4. lib/engine.ts
5. store/store.ts
6. styles/globals.css        (tokens Botly)
7. SwipeCard.tsx + SwipeDeck.tsx
8. SwipePage.tsx
9. ProductCard.tsx
10. ExplorerPage.tsx
11. PromptBlock.tsx + McpBlock.tsx
12. BundlePage.tsx
13. main.tsx (routing)
14. styles polish + responsive
```