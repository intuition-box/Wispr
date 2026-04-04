#!/usr/bin/env node
/**
 * Wispear Ontology - Seed to Intuition Protocol Mainnet
 *
 * Creates atoms and triples on Intuition Protocol using the MultiVault contract.
 *
 * Usage:
 *   bun --filter @wispr/ontology seed:intuition
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
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { PinataSDK } from "pinata";

// Load environment variables from current directory (packages/ontology)
config({ path: resolve(process.cwd(), ".env") });

// Initialize Pinata for favicon uploads
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
});

// Intuition Mainnet configuration
const CHAIN_ID = 1155;
const RPC_URL = "https://rpc.intuition.systems/http";
const MULTIVAULT_ADDRESS = "0x6E35cF57A41fA15eA0EaE9C33e751b01A784Fe7e";
const INTUITION_GRAPHQL_URL = "https://mainnet.intuition.sh/v1/graphql";

// MultiVault ABI (minimal for atom/triple creation)
const MULTIVAULT_ABI = [
  "function getAtomCost() view returns (uint256)",
  "function getTripleCost() view returns (uint256)",
  "function calculateAtomId(bytes data) pure returns (bytes32)",
  "function calculateTripleId(bytes32 subjectId, bytes32 predicateId, bytes32 objectId) pure returns (bytes32)",
  "function isTermCreated(bytes32 id) view returns (bool)",
  "function createAtoms(bytes[] data, uint256[] assets) payable returns (bytes32[])",
  "function createTriples(bytes32[] subjectIds, bytes32[] predicateIds, bytes32[] objectIds, uint256[] assets) payable returns (bytes32[])",
];


// Atom definition
interface AtomData {
  id: string;       // Atom ID from ontology (e.g., "mcp-notion")
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

// Load ontology data from JSON using absolute path from cwd
// Accepts --file flag to specify which ontology to seed, defaults to w4-p3
const fileArg = process.argv.find(a => a.startsWith("--file="));
const ontologyFile = fileArg ? fileArg.split("=")[1] : "ontology-foundation-w4-p3.json";
const ONTOLOGY_PATH = resolve(process.cwd(), `../../plans/${ontologyFile}`);
const ontology = JSON.parse(readFileSync(ONTOLOGY_PATH, "utf-8"));

// Load IPFS mapping (created by upload-favicons script)
const IPFS_MAPPING_PATH = resolve(process.cwd(), "favicons/ipfs-mapping.json");
let ipfsMapping: Record<string, string> = {};
try {
  ipfsMapping = JSON.parse(readFileSync(IPFS_MAPPING_PATH, "utf-8"));
} catch {
  console.warn("⚠️  No IPFS mapping found. Run 'bun download:favicons' and 'bun upload:favicons' first.");
}

// Helper: Extract the correct domain for the favicon based on component name and URL
function getFaviconDomain(atom: AtomData): string | null {
  // Special case: MCPs should use the service they integrate with, not the repo host (e.g., GitHub)
  if (atom.label.toLowerCase().startsWith("mcp ")) {
    const serviceName = atom.label.toLowerCase().replace("mcp ", "").trim();

    // Map MCP names to their service domains
    const mcpServiceMap: Record<string, string> = {
      "notion": "notion.so",
      "twitter": "twitter.com",
      "x": "twitter.com",
      "github": "github.com",
      "slack": "slack.com",
      "linear": "linear.app",
      "figma": "figma.com",
      "google drive": "drive.google.com",
      "gmail": "gmail.com",
      "calendar": "calendar.google.com",
    };

    const mappedDomain = mcpServiceMap[serviceName];
    if (mappedDomain) {
      return mappedDomain;
    }
  }

  // For non-MCP components, extract domain from URL
  if (!atom.url) return null;
  try {
    const urlObj = new URL(atom.url.startsWith("http") ? atom.url : `https://${atom.url}`);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return null;
  }
}

// Helper: Download favicon and upload to Pinata IPFS
async function uploadFaviconToIPFS(domain: string): Promise<string> {
  try {
    // Try Google's favicon service first (most reliable)
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

    // Fetch the favicon
    const response = await fetch(faviconUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch favicon: ${response.statusText}`);
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Upload to Pinata
    const file = new File([buffer], `${domain}-favicon.png`, { type: "image/png" });
    const upload = await pinata.upload.public.file(file);

    const ipfsUri = `https://gateway.pinata.cloud/ipfs/${upload.cid}`;
    return ipfsUri;
  } catch (error) {
    console.warn(`   ⚠️  Failed to upload favicon for ${domain}:`, error);
    // Fallback to placeholder
    return "https://via.placeholder.com/256x256.png?text=Wispear";
  }
}

// Helper: Get logo URL for a component (from IPFS mapping or fallback)
async function getLogoUrl(atom: AtomData): Promise<string> {
  // First, check if we have an IPFS URI from the mapping
  if (ipfsMapping[atom.id]) {
    return ipfsMapping[atom.id];
  }

  // Fallback: Try to download and upload on-the-fly (if not in mapping)
  const domain = getFaviconDomain(atom);
  if (domain) {
    console.warn(`   ⚠️  No IPFS mapping for ${atom.id}, downloading on-the-fly...`);
    return await uploadFaviconToIPFS(domain);
  }

  // Final fallback: Wispear placeholder
  return "https://via.placeholder.com/256x256.png?text=Wispear";
}

// Helper: Pin atom metadata via Intuition GraphQL service
async function pinAtomToIntuition(atom: AtomData): Promise<string> {
  const mutation = `
    mutation PinThing($name: String!, $description: String!, $image: String!, $url: String) {
      pinThing(thing: {
        name: $name
        description: $description
        image: $image
        url: $url
      }) {
        uri
      }
    }
  `;

  const logoUrl = await getLogoUrl(atom);

  const variables = {
    name: atom.label,
    description: atom.description,
    image: logoUrl,
    url: atom.url || null,
  };

  try {
    const response = await fetch(INTUITION_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json() as { data?: { pinThing?: { uri?: string } }; errors?: unknown[] };

    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    const uri = result.data?.pinThing?.uri;

    if (!uri) {
      console.error(`   ❌ Response:`, result);
      throw new Error("No URI returned from Intuition GraphQL");
    }

    console.log(`   📌 Pinned via Intuition: ${uri}`);
    return uri;
  } catch (error) {
    console.error(`   ❌ Failed to pin ${atom.label}:`, error);
    throw error;
  }
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
    id: atom.id,
    label: atom.name,
    description: atom.description || "",
    url: atom.url,
  }));

  // In test mode, create atoms needed for 1 complete component chain
  if (isTestMode) {
    // For testing: mcp-notion chain
    // Atoms needed: mcp-notion, tool, is-best-of, in-context-of, content-automation, belongs-to, productivity
    const testAtomIds = [
      "mcp-notion",           // component
      "tool",                 // type
      "is-best-of",           // predicate
      "in-context-of",        // predicate
      "content-automation",   // context
      "belongs-to",           // predicate
      "productivity"          // category
    ];
    atoms = atoms.filter(a => testAtomIds.includes(a.id));
    console.log(`🧪 TEST MODE: Creating complete chain for mcp-notion`);
    console.log(`📝 Will create ${atoms.length} atoms:\n`);
    atoms.forEach(a => console.log(`   - ${a.label}`));
    console.log("");
  } else {
    console.log(`📝 Total atoms to create: ${atoms.length}\n`);
  }

  // Prepare atom data with IDs (pin via Intuition GraphQL first)
  console.log("📌 Pinning atoms via Intuition GraphQL...\n");

  const atomsWithData = [];

  for (let index = 0; index < atoms.length; index++) {
    const atom = atoms[index];
    console.log(`[${index + 1}/${atoms.length}] ${atom.label}`);

    // Pin via Intuition GraphQL and get URI
    const uri = await pinAtomToIntuition(atom);
    const hexData = ethers.hexlify(ethers.toUtf8Bytes(uri));
    const atomId = await contract.calculateAtomId(hexData);

    // Check if atom already exists on-chain
    const exists = await contract.isTermCreated(atomId);

    atomsWithData.push({
      ...atom,
      uri,
      hexData,
      atomId,
      exists,
    });

    // Add delay to avoid rate limiting
    if (index < atoms.length - 1) {
      await delay(800); // 800ms between uploads
    }
  }

  console.log("");

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

  // Load previously deployed atom IDs (from w4-p3 or other seeds)
  const previousDeployedPath = resolve(process.cwd(), "src/seed/deployed.json");
  try {
    const deployed = JSON.parse(readFileSync(previousDeployedPath, "utf-8"));
    if (deployed.atoms) {
      for (const [id, termId] of Object.entries(deployed.atoms)) {
        createdAtomIds.set(id, termId as string);
      }
      console.log(`📂 Loaded ${Object.keys(deployed.atoms).length} existing atom IDs from deployed.json\n`);
    }
  } catch {
    // No previous deployment, that's fine
  }

  // Store existing atom IDs (keyed by ontology id, e.g. "mcp-notion")
  existing.forEach((a) => {
    createdAtomIds.set(a.id, a.atomId);
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
        const tx = await contract.createAtoms(
          atomDatas,
          assets,
          { value: totalCost }
        );

        console.log(`📤 Tx submitted: ${tx.hash}`);

        const receipt = await waitForTx(provider, tx.hash);

        if (receipt && receipt.status === 1) {
          console.log(`✅ Batch ${batchNum} created successfully!\n`);

          // Store created atom IDs (keyed by ontology id, e.g. "mcp-notion")
          batch.forEach((a) => {
            createdAtomIds.set(a.id, a.atomId);
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

  console.log(`\n✅ All atoms created with succes !\n`);
  console.log("📋 Atom ID mapping:");
  createdAtomIds.forEach((id, label) => {
    console.log(`  ${label}: ${id}`);
  });

  // Save atom IDs to file for triple creation
  const atomIdMap: Record<string, string> = {};
  createdAtomIds.forEach((id, label) => {
    atomIdMap[label] = id;
  });

  const atomIdMapPath = resolve(process.cwd(), "src/seed/atom-ids.json");
  writeFileSync(atomIdMapPath, JSON.stringify(atomIdMap, null, 2));
  console.log(`\n💾 Atom IDs saved to: ${atomIdMapPath}\n`);

  // In test mode, we continue to create triples for the test component
  if (isTestMode) {
    console.log("🧪 TEST MODE: Creating triples for mcp-notion chain\n");
  }

  // === TIER 1: Create base triples (component → is-best-of → type) ===
  console.log(`\n🔗 TIER 1: Creating base triples (is-best-of)...\n`);

  let baseTriples = ontology.triples.base_triples;

  // In test mode, only create triples for mcp-notion
  if (isTestMode) {
    baseTriples = baseTriples.filter((t: any) => t.id === "T1-mcp-notion");
  }

  const baseTripleIds = new Map<string, string>(); // Maps triple.id → tripleTermId

  console.log(`📝 ${baseTriples.length} base triples to create\n`);

  // Process base triples
  const subjectIds: string[] = [];
  const predicateIds: string[] = [];
  const objectIds: string[] = [];
  const assets: bigint[] = [];
  const tripleMetadata: Array<{ id: string; subject: string; predicate: string; object: string }> = [];

  for (const triple of baseTriples) {
    const subjectId = createdAtomIds.get(triple.subject);
    const predicateId = createdAtomIds.get(triple.predicate);
    const objectId = createdAtomIds.get(triple.object);

    if (!subjectId || !predicateId || !objectId) {
      console.warn(`⚠️  Skipping base triple ${triple.id}: missing atoms`);
      continue;
    }

    const tripleTermId = await contract.calculateTripleId(subjectId, predicateId, objectId);
    const tripleExists = await contract.isTermCreated(tripleTermId);
    if (tripleExists) {
      console.log(`   ✅ Already exists: ${triple.subject} → ${triple.predicate} → ${triple.object}`);
      baseTripleIds.set(triple.id, tripleTermId);
      continue;
    }

    console.log(`   ${triple.subject} → ${triple.predicate} → ${triple.object}`);

    subjectIds.push(subjectId);
    predicateIds.push(predicateId);
    objectIds.push(objectId);
    assets.push(tripleCost);
    tripleMetadata.push({ id: triple.id, subject: triple.subject, predicate: triple.predicate, object: triple.object });
  }

  if (subjectIds.length > 0) {
    const totalCost = tripleCost * BigInt(subjectIds.length);
    console.log(`\n💸 Cost: ${ethers.formatEther(totalCost)} TRUST`);

    try {
      const tx = await contract.createTriples(
        subjectIds,
        predicateIds,
        objectIds,
        assets,
        { value: totalCost }
      );

      console.log(`📤 Tx submitted: ${tx.hash}`);
      const receipt = await waitForTx(provider, tx.hash);

      if (receipt && receipt.status === 1) {
        console.log(`✅ Base triples created successfully!\n`);

        for (let i = 0; i < tripleMetadata.length; i++) {
          const metadata = tripleMetadata[i];
          const tripleId = await contract.calculateTripleId(subjectIds[i], predicateIds[i], objectIds[i]);
          baseTripleIds.set(metadata.id, tripleId);
          console.log(`   ${metadata.id}: ${tripleId}`);
        }
      } else {
        console.error(`❌ Base triples creation failed!\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating base triples:`, error);
    }

    await delay(2000);
  }

  // === TIER 2: Create nested triples (T1 → in-context-of → context) ===
  console.log(`\n🔗 TIER 2: Creating nested triples (in-context-of)...\n`);

  let nestedTriples = ontology.triples.nested_triples;

  // In test mode, only create nested triples for mcp-notion
  if (isTestMode) {
    nestedTriples = nestedTriples.filter((t: any) => t.subject_triple === "T1-mcp-notion");
  }

  console.log(`📝 ${nestedTriples.length} nested triples to create\n`);

  const nestedTripleIds = new Map<string, string>(); // Maps "T1-id→context-id" → termId
  const nestedToCreate: Array<{ key: string; subjectTripleId: string; predicateId: string; objectId: string }> = [];

  for (const triple of nestedTriples) {
    const subjectTripleId = baseTripleIds.get(triple.subject_triple);
    const predicateId = createdAtomIds.get(triple.predicate);
    const objectId = createdAtomIds.get(triple.object);

    if (!subjectTripleId || !predicateId || !objectId) {
      console.warn(`⚠️  Skipping nested triple: ${triple.subject_triple} → ${triple.predicate} → ${triple.object}`);
      continue;
    }

    const termId = await contract.calculateTripleId(subjectTripleId, predicateId, objectId);
    const key = `${triple.subject_triple}→${triple.object}`;

    if (await contract.isTermCreated(termId)) {
      console.log(`   ✅ Already exists: (${triple.subject_triple}) → ${triple.predicate} → ${triple.object}`);
      nestedTripleIds.set(key, termId);
      continue;
    }

    console.log(`   (${triple.subject_triple}) → ${triple.predicate} → ${triple.object}`);
    nestedToCreate.push({ key, subjectTripleId, predicateId, objectId });
  }

  if (nestedToCreate.length > 0) {
    const totalCost = tripleCost * BigInt(nestedToCreate.length);
    console.log(`\n💸 Cost: ${ethers.formatEther(totalCost)} TRUST`);

    try {
      const tx = await contract.createTriples(
        nestedToCreate.map(t => t.subjectTripleId),
        nestedToCreate.map(t => t.predicateId),
        nestedToCreate.map(t => t.objectId),
        nestedToCreate.map(() => tripleCost),
        { value: totalCost }
      );

      console.log(`📤 Tx submitted: ${tx.hash}`);
      const receipt = await waitForTx(provider, tx.hash);

      if (receipt && receipt.status === 1) {
        console.log(`✅ Nested triples created successfully!\n`);
        for (const t of nestedToCreate) {
          const termId = await contract.calculateTripleId(t.subjectTripleId, t.predicateId, t.objectId);
          nestedTripleIds.set(t.key, termId);
        }
      } else {
        console.error(`❌ Nested triples creation failed!\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating nested triples:`, error);
    }

    await delay(2000);
  }

  // === TIER 3: Create category triples (context → belongs-to → category) ===
  console.log(`\n🔗 TIER 3: Creating category triples (belongs-to)...\n`);

  let categoryTriples = ontology.triples.category_triples;

  if (isTestMode) {
    categoryTriples = categoryTriples.filter((t: any) => t.subject === "content-automation");
  }

  console.log(`📝 ${categoryTriples.length} category triples to create\n`);

  const categoryTripleIds = new Map<string, string>(); // Maps "subject→object" → termId
  const categoryToCreate: Array<{ key: string; subjectId: string; predicateId: string; objectId: string }> = [];

  for (const triple of categoryTriples) {
    const subjectId = createdAtomIds.get(triple.subject);
    const predicateId = createdAtomIds.get(triple.predicate);
    const objectId = createdAtomIds.get(triple.object);

    if (!subjectId || !predicateId || !objectId) {
      console.warn(`⚠️  Skipping category triple: ${triple.subject} → ${triple.predicate} → ${triple.object}`);
      continue;
    }

    const termId = await contract.calculateTripleId(subjectId, predicateId, objectId);
    const key = `${triple.subject}→${triple.object}`;

    if (await contract.isTermCreated(termId)) {
      console.log(`   ✅ Already exists: ${triple.subject} → ${triple.predicate} → ${triple.object}`);
      categoryTripleIds.set(key, termId);
      continue;
    }

    console.log(`   ${triple.subject} → ${triple.predicate} → ${triple.object}`);
    categoryToCreate.push({ key, subjectId, predicateId, objectId });
  }

  if (categoryToCreate.length > 0) {
    const totalCost = tripleCost * BigInt(categoryToCreate.length);
    console.log(`\n💸 Cost: ${ethers.formatEther(totalCost)} TRUST`);

    try {
      const tx = await contract.createTriples(
        categoryToCreate.map(t => t.subjectId),
        categoryToCreate.map(t => t.predicateId),
        categoryToCreate.map(t => t.objectId),
        categoryToCreate.map(() => tripleCost),
        { value: totalCost }
      );

      console.log(`📤 Tx submitted: ${tx.hash}`);
      const receipt = await waitForTx(provider, tx.hash);

      if (receipt && receipt.status === 1) {
        console.log(`✅ Category triples created successfully!\n`);
        for (const t of categoryToCreate) {
          const termId = await contract.calculateTripleId(t.subjectId, t.predicateId, t.objectId);
          categoryTripleIds.set(t.key, termId);
        }
      } else {
        console.error(`❌ Category triples creation failed!\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating category triples:`, error);
    }
  }

  // === Save deployed.json with all atom and triple IDs ===
  const deployed: Record<string, any> = {
    atoms: Object.fromEntries(createdAtomIds),
    triples: {
      base: Object.fromEntries(baseTripleIds),
      nested: Object.fromEntries(nestedTripleIds),
      category: Object.fromEntries(categoryTripleIds),
    }
  };

  const deployedPath = resolve(process.cwd(), "src/seed/deployed.json");
  writeFileSync(deployedPath, JSON.stringify(deployed, null, 2));
  console.log(`\n💾 Deployed addresses saved to: ${deployedPath}\n`);

  console.log("\n🎉 Ontology seed complete!");

  console.log("\n✅ Next steps:");
  console.log("   1. Verify atoms on https://portal.intuition.systems");
  if (isTestMode) {
    console.log("   2. Run 'bun seed:full' to create complete ontology\n");
  } else {
    console.log("   2. Test MCP search_atoms to verify discovery");
    console.log("   3. Test Wispear chatbot blueprint generation\n");
  }

}

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
