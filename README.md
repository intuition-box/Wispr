# Wispear

Collective wisdom, whispered to your agent.

## Live

| App | URL |
|-----|-----|
| Chat | https://chat.wispear.ai |
| Curator | https://curator.wispear.ai |
| UI (Storybook) | https://ui.wispear.ai |

## Development

```bash
pnpm install
```

Run everything:

```bash
pnpm dev
```

Or run individually:

```bash
# Chat app — http://localhost:3000
pnpm --filter @wispr/chat dev

# Curator app — http://localhost:3001
pnpm --filter @wispr/curator dev

# UI Storybook — http://localhost:6006
pnpm --filter @wispr/ui storybook
```

Build all packages:

```bash
pnpm build
```
