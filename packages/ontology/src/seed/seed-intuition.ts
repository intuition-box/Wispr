#!/usr/bin/env node
/**
 * Wispear Ontology - Seed to Intuition Protocol Mainnet
 *
 * Creates atoms and triples on Intuition Protocol using the MultiVault contract.
 *
 * Usage:
 *   pnpm --filter @wispr/ontology seed:intuition
 *
 * Requirements:
 *   - PRIVATE_KEY in .env file
 *   - Sufficient TRUST tokens for atom/triple creation
 *
 * Network: Intuition Mainnet (Chain ID 1155)
 * Contract: MultiVault at 0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e
 */

import { ethers } from "ethers";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
config();

// Intuition Mainnet configuration
const CHAIN_ID = 1155;
const RPC_URL = "https://rpc.intuition.systems/http";
const MULTIVAULT_ADDRESS = "0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e";

// MultiVault ABI (minimal for atom/triple creation)
const MULTIVAULT_ABI = [
  "function getAtomCost() view returns (uint256)",
  "function getTripleCost() view returns (uint256)",
  "function calculateAtomId(bytes data) pure returns (bytes32)",
  "function isTermCreated(bytes32 id) view returns (bool)",
  "function createAtoms(bytes[] atomDatas, uint256[] assets) payable returns (bytes32[])",
  "function createTriples(bytes32[] subjectIds, bytes32[] predicateIds, bytes32[] objectIds, uint256[] assets) payable returns (bytes32[])",
];

// Atom definition
interface AtomData {
  label: string;
  description: string;
  url?: string;
}

// Triple definition
interface TripleData {
  subject: string;  // label of subject atom
  predicate: string; // label of predicate atom
  object: string;   // label of object atom
}

// Load ontology data from JSON
const ONTOLOGY_PATH = join(__dirname, "../../../plans/ontology-foundation-w4-p3.json");
const ontology = JSON.parse(readFileSync(ONTOLOGY_PATH, "utf-8"));

// Helper: Convert atom data to IPFS URI
function atomToIPFSUri(atom: AtomData): string {
  const json = JSON.stringify({
    name: atom.label,
    description: atom.description,
    ...(atom.url && { external_url: atom.url }),
  });
  // For now, we'll use a simple data URI instead of actual IPFS
  // In production, you should upload to IPFS first
  return `data:application/json,${encodeURIComponent(json)}`;
}

// Helper: Wait for transaction with custom polling
async function waitForTx(provider: ethers.Provider, txHash: string): Promise<ethers.TransactionReceipt | null> {
  console.log(`⏳ Waiting for tx: ${txHash}`);
  let receipt = null;
  let attempts = 0;
  const maxAttempts = 60; // 5 minutes max

  while (!receipt && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s interval
    receipt = await provider.getTransactionReceipt(txHash);
    attempts++;
  }

  return receipt;
}

// Helper: Delay to avoid rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // Detect mode from command line arguments
  const isTestMode = process.argv.includes("--test");
  const isFullMode = process.argv.includes("--full");

  // Display mode
  if (isTestMode) {
    console.log("🧪 MODE TEST - Creating 1 atom only\n");
  } else if (isFullMode) {
    console.log("🚀 MODE FULL - Creating all atoms and triples\n");
  } else {
    console.log("🌱 Wispear Ontology Seed - Intuition Protocol Mainnet\n");
  }

  // Check for private key (NEVER display it)
  if (!process.env.PRIVATE_KEY) {
    console.error("❌ PRIVATE_KEY not found in .env file");
    console.error("   Create a .env file with: PRIVATE_KEY=0x...");
    process.exit(1);
  }

  // Validate private key format (NEVER display the actual key)
  if (!process.env.PRIVATE_KEY.startsWith("0x")) {
    console.error("❌ PRIVATE_KEY must start with 0x");
    process.exit(1);
  }

  console.log("✅ PRIVATE_KEY found in .env\n");

  // Setup provider with custom polling interval
  const provider = new ethers.JsonRpcProvider(RPC_URL, CHAIN_ID, {
    polling: true,
    pollingInterval: 30000, // 30s to avoid aggressive polling
  });

  // Setup wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  console.log(`🔑 Using wallet: ${wallet.address}\n`);

  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`💰 TRUST Balance: ${ethers.formatEther(balance)} TRUST\n`);

  // Connect to MultiVault contract
  const contract = new ethers.Contract(MULTIVAULT_ADDRESS, MULTIVAULT_ABI, wallet);

  // Get costs
  const atomCost = await contract.getAtomCost();
  const tripleCost = await contract.getTripleCost();
  console.log(`💵 Atom cost: ${ethers.formatEther(atomCost)} TRUST`);
  console.log(`💵 Triple cost: ${ethers.formatEther(tripleCost)} TRUST\n`);

  // Prepare atoms from ontology
  let atoms: AtomData[] = ontology.atoms.map((atom: any) => ({
    label: atom.name,
    description: atom.description || "",
    url: atom.url,
  }));

  // In test mode, only create the first atom
  if (isTestMode) {
    atoms = atoms.slice(0, 1);
    console.log(`🧪 TEST MODE: Will create only 1 atom: "${atoms[0].label}"\n`);
  } else {
    console.log(`📝 Total atoms to create: ${atoms.length}\n`);
  }

  // Prepare atom data with IDs
  const atomsWithData = await Promise.all(
    atoms.map(async (atom, index) => {
      const uri = atomToIPFSUri(atom);
      const hexData = ethers.hexlify(ethers.toUtf8Bytes(uri));
      const atomId = await contract.calculateAtomId(hexData);

      // Add delay to avoid rate limiting
      if (index > 0 && index % 2 === 0) {
        await delay(400);
      }

      const exists = await contract.isTermCreated(atomId);

      await delay(800);

      return {
        ...atom,
        uri,
        hexData,
        atomId,
        exists,
      };
    })
  );

  // Filter atoms that need to be created
  const toCreate = atomsWithData.filter((a) => !a.exists);
  const existing = atomsWithData.filter((a) => a.exists);

  console.log(`✅ Already exist: ${existing.length}`);
  console.log(`🆕 To create: ${toCreate.length}\n`);

  if (existing.length > 0) {
    console.log("Existing atoms:");
    existing.forEach((a) => console.log(`  - ${a.label} (${a.atomId})`));
    console.log("");
  }

  // Create atoms in batches of 20
  const BATCH_SIZE = 20;
  const createdAtomIds: Map<string, string> = new Map();

  // Store existing atom IDs
  existing.forEach((a) => {
    createdAtomIds.set(a.label, a.atomId);
  });

  if (toCreate.length > 0) {
    console.log(`🔨 Creating ${toCreate.length} atoms in batches of ${BATCH_SIZE}...\n`);

    for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
      const batch = toCreate.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(toCreate.length / BATCH_SIZE);

      console.log(`📦 Batch ${batchNum}/${totalBatches} (${batch.length} atoms)`);
      batch.forEach((a) => console.log(`   - ${a.label}`));

      const atomDatas = batch.map((a) => a.hexData);
      const assets = batch.map(() => atomCost);
      const totalCost = atomCost * BigInt(batch.length);

      console.log(`💸 Cost: ${ethers.formatEther(totalCost)} TRUST`);

      try {
        const tx = await contract.createAtoms(atomDatas, assets, {
          value: totalCost,
        });

        console.log(`📤 Tx submitted: ${tx.hash}`);

        const receipt = await waitForTx(provider, tx.hash);

        if (receipt && receipt.status === 1) {
          console.log(`✅ Batch ${batchNum} created successfully!\n`);

          // Store created atom IDs
          batch.forEach((a) => {
            createdAtomIds.set(a.label, a.atomId);
          });
        } else {
          console.error(`❌ Batch ${batchNum} failed!\n`);
        }
      } catch (error) {
        console.error(`❌ Error creating batch ${batchNum}:`, error);
      }

      // Delay between batches
      if (i + BATCH_SIZE < toCreate.length) {
        await delay(2000);
      }
    }
  }

  console.log(`\n✅ All atoms created!\n`);
  console.log("📋 Atom ID mapping:");
  createdAtomIds.forEach((id, label) => {
    console.log(`  ${label}: ${id}`);
  });

  // Save atom IDs to file for triple creation
  const atomIdMap: Record<string, string> = {};
  createdAtomIds.forEach((id, label) => {
    atomIdMap[label] = id;
  });

  const atomIdMapPath = join(__dirname, "atom-ids.json");
  writeFileSync(atomIdMapPath, JSON.stringify(atomIdMap, null, 2));
  console.log(`\n💾 Atom IDs saved to: ${atomIdMapPath}\n`);

  // Skip triple creation in test mode
  if (isTestMode) {
    console.log("🧪 TEST MODE: Skipping triple creation\n");
    console.log("✅ Test complete!");
    console.log("\n📊 Summary:");
    console.log(`   - Atoms created: ${createdAtomIds.size}`);
    console.log(`   - Triples created: 0 (test mode)`);
    console.log("\n🚀 Next step: Run 'pnpm --filter @wispr/ontology seed:full' to create all atoms and triples\n");
    return;
  }

  // Prepare triples from ontology
  const triples: TripleData[] = ontology.triples.map((triple: any) => {
    // Find atom labels from ontology
    const subject = ontology.atoms.find((a: any) => a.id === triple.subject);
    const object = ontology.atoms.find((a: any) => a.id === triple.object);

    return {
      subject: subject?.name || triple.subject,
      predicate: triple.predicate,
      object: object?.name || triple.object,
    };
  });

  console.log(`🔗 Creating ${triples.length} triples...\n`);

  // Create triples in batches of 15
  const TRIPLE_BATCH_SIZE = 15;

  for (let i = 0; i < triples.length; i += TRIPLE_BATCH_SIZE) {
    const batch = triples.slice(i, i + TRIPLE_BATCH_SIZE);
    const batchNum = Math.floor(i / TRIPLE_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(triples.length / TRIPLE_BATCH_SIZE);

    console.log(`📦 Triple Batch ${batchNum}/${totalBatches} (${batch.length} triples)`);

    const subjectIds: string[] = [];
    const predicateIds: string[] = [];
    const objectIds: string[] = [];
    const assets: bigint[] = [];

    for (const triple of batch) {
      const subjectId = createdAtomIds.get(triple.subject);
      const predicateId = createdAtomIds.get(triple.predicate);
      const objectId = createdAtomIds.get(triple.object);

      if (!subjectId || !predicateId || !objectId) {
        console.warn(`⚠️  Skipping triple (missing atoms): ${triple.subject} → ${triple.predicate} → ${triple.object}`);
        continue;
      }

      console.log(`   ${triple.subject} → ${triple.predicate} → ${triple.object}`);

      subjectIds.push(subjectId);
      predicateIds.push(predicateId);
      objectIds.push(objectId);
      assets.push(tripleCost);
    }

    if (subjectIds.length === 0) {
      console.log(`⚠️  No valid triples in batch ${batchNum}, skipping\n`);
      continue;
    }

    const totalCost = tripleCost * BigInt(subjectIds.length);
    console.log(`💸 Cost: ${ethers.formatEther(totalCost)} TRUST`);

    try {
      const tx = await contract.createTriples(subjectIds, predicateIds, objectIds, assets, {
        value: totalCost,
      });

      console.log(`📤 Tx submitted: ${tx.hash}`);

      const receipt = await waitForTx(provider, tx.hash);

      if (receipt && receipt.status === 1) {
        console.log(`✅ Triple batch ${batchNum} created successfully!\n`);
      } else {
        console.error(`❌ Triple batch ${batchNum} failed!\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating triple batch ${batchNum}:`, error);
    }

    // Delay between batches
    if (i + TRIPLE_BATCH_SIZE < triples.length) {
      await delay(2000);
    }
  }

  console.log("\n🎉 Ontology seed complete!");
  console.log("\n✅ Next steps:");
  console.log("   1. Verify atoms on https://explorer.intuition.systems");
  console.log("   2. Test MCP search_atoms to verify discovery");
  console.log("   3. Test Wispear chatbot blueprint generation\n");
}

// Add missing import
import { writeFileSync } from "fs";

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
