# @wispr/ontology

> Wispear ontology types, seed data, and Intuition Protocol integration

---

## Overview

This package contains:
- **TypeScript types** for components, triples, profiles, and curators
- **Seed data** for bootstrapping the knowledge graph
- **Mock data** for W4 and P3 use cases
- **Seed script** for publishing ontology to Intuition Protocol

---

## Seed to Intuition Protocol

### Prerequisites

1. **Create a `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Add your private key** to `.env`:
   ```
   PRIVATE_KEY=0x...
   ```

   ⚠️ **NEVER commit your `.env` file!** It's already in `.gitignore`.

3. **Get TRUST tokens** on Intuition mainnet (Chain ID 1155)
   - Network: https://rpc.intuition.systems/http
   - Explorer: https://explorer.intuition.systems
   - You'll need TRUST to pay for atom/triple creation

---

## Usage

### Test Mode (Recommended First)

**Creates only 1 atom** to verify everything works:

```bash
pnpm --filter @wispr/ontology seed:test
```

**Expected output:**
```
🧪 MODE TEST - Creating 1 atom only

✅ PRIVATE_KEY found in .env

🔑 Using wallet: 0x...
💰 TRUST Balance: 1.5 TRUST

💵 Atom cost: 0.001 TRUST
💵 Triple cost: 0.005 TRUST

🧪 TEST MODE: Will create only 1 atom: "is-best-of"

📦 Batch 1/1 (1 atoms)
   - is-best-of
💸 Cost: 0.001 TRUST
📤 Tx submitted: 0x...
✅ Batch 1 created successfully!

✅ Test complete!
📊 Summary:
   - Atoms created: 1
   - Triples created: 0 (test mode)

🚀 Next step: Run 'pnpm --filter @wispr/ontology seed:full' to create all atoms and triples
```

---

### Full Mode

**Creates all 19 atoms + 16 triples:**

```bash
pnpm --filter @wispr/ontology seed:full
```

**What it does:**
1. Creates **19 atoms**:
   - 3 predicates (is-best-of, in-context-of, belongs-to)
   - 3 types (tool, skill, model)
   - 6 contexts (content-automation, social-media, content-generation, defi, web3-building, web3)
   - 7 components (MCP Notion, MCP Twitter, Claude Sonnet 4.5, Chainlink, 1inch, Privy, brand-voice-skill)

2. Creates **16 triples**:
   - 7 classification triples (component → is-best-of → type)
   - 7 context triples (component → in-context-of → context)
   - 2 hierarchy triples (context → belongs-to → parent context)

3. Saves all atom IDs to `src/seed/atom-ids.json`

**Estimated cost:**
- Atoms: 19 × 0.001 TRUST = ~0.019 TRUST
- Triples: 16 × 0.005 TRUST = ~0.080 TRUST
- **Total: ~0.1 TRUST**

---

## Verification

After running the seed, verify on Intuition Explorer:
- https://explorer.intuition.systems

Test MCP discovery:
```bash
curl -X POST http://localhost:3001/mcp \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "method": "callTool",
    "params": {
      "name": "search_atoms",
      "arguments": {
        "queries": ["notion", "twitter", "chainlink"]
      }
    },
    "id": 1
  }'
```

If atoms are found, the Wispear chatbot can now build blueprints! 🎉

---

## Troubleshooting

### `PRIVATE_KEY not found in .env file`
Create a `.env` file in the project root with your private key.

### `PRIVATE_KEY must start with 0x`
Make sure your private key has the `0x` prefix.

### Insufficient TRUST balance
Get TRUST tokens on Intuition mainnet. Check your balance on the explorer.

### Transaction failed
- Check that you have enough TRUST for gas + atom/triple costs
- Verify you're connected to Intuition mainnet (Chain ID 1155)
- Check transaction status on https://explorer.intuition.systems

---

## Network Details

| Parameter | Value |
|-----------|-------|
| Chain ID | 1155 |
| RPC URL | https://rpc.intuition.systems/http |
| Explorer | https://explorer.intuition.systems |
| Native Token | TRUST (18 decimals) |
| MultiVault Contract | 0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e |

---

## Security

⚠️ **NEVER commit your `.env` file or share your PRIVATE_KEY!**

The seed script:
- ✅ Never displays your PRIVATE_KEY in logs
- ✅ Only shows your public wallet address
- ✅ Validates PRIVATE_KEY format before use
- ✅ Uses environment variables for sensitive data

---

## Development

```bash
# Build TypeScript
pnpm build

# Watch mode
pnpm dev

# Type check
pnpm typecheck
```

---

## Related Files

- [ontology-foundation-w4-p3.json](../../plans/ontology-foundation-w4-p3.json) - Source ontology data
- [intuition-forge-atoms.csv](../../plans/intuition-forge-atoms.csv) - CSV export for manual upload
- [intuition-forge-triples.md](../../plans/intuition-forge-triples.md) - Triple creation guide

---

**Questions?** Check the main project docs in `/plans/projet-overview/team-alignment.md`
