#!/usr/bin/env node
/**
 * Step 2: Upload all favicons to Pinata IPFS
 *
 * This script:
 * - Reads downloaded favicons from packages/ontology/favicons/
 * - Uploads each favicon to Pinata IPFS
 * - Generates a mapping JSON with IPFS URIs
 *
 * Usage:
 *   pnpm --filter @wispr/ontology upload:favicons
 */

import { config } from "dotenv";
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { resolve } from "path";
import { PinataSDK } from "pinata";

// Load environment variables
config({ path: resolve(process.cwd(), ".env") });

// Initialize Pinata
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
});

const FAVICONS_DIR = resolve(process.cwd(), "favicons");

// Helper: Delay to avoid rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("📤 Wispear Ontology - Upload Favicons to Pinata IPFS\n");

  // Check for Pinata JWT
  if (!process.env.PINATA_JWT) {
    console.error("❌ PINATA_JWT not found in .env file");
    console.error("   Create a .env file with: PINATA_JWT=...");
    process.exit(1);
  }

  console.log("✅ PINATA_JWT found in .env\n");

  // Read favicon mapping
  const mappingPath = resolve(FAVICONS_DIR, "favicon-mapping.json");
  const mapping = JSON.parse(readFileSync(mappingPath, "utf-8"));

  // Find all downloaded favicons
  const files = readdirSync(FAVICONS_DIR).filter((f) => f.endsWith(".png"));

  console.log(`📝 Found ${files.length} favicon files to upload\n`);

  const ipfsMapping: Record<string, string> = {};

  for (const file of files) {
    const atomId = file.replace(".png", "");
    const filePath = resolve(FAVICONS_DIR, file);

    console.log(`[${atomId}]`);

    try {
      // Read file
      const buffer = readFileSync(filePath);
      const fileObj = new File([buffer], file, { type: "image/png" });

      // Upload to Pinata with PUBLIC access (so it's accessible via IPFS gateways)
      console.log(`   📤 Uploading to Pinata (public IPFS)...`);
      const upload = await pinata.upload.public.file(fileObj);

      // Use public IPFS gateway (ipfs.io) instead of Pinata gateway for better compatibility
      const ipfsUri = `https://ipfs.io/ipfs/${upload.cid}`;
      ipfsMapping[atomId] = ipfsUri;

      console.log(`   ✅ Uploaded: ${ipfsUri}`);
      console.log("");

      // Delay to avoid rate limits
      await delay(500);
    } catch (error) {
      console.error(`   ❌ Failed to upload:`, error);
      console.log("");
    }
  }

  // Save IPFS mapping
  const ipfsMappingPath = resolve(FAVICONS_DIR, "ipfs-mapping.json");
  writeFileSync(ipfsMappingPath, JSON.stringify(ipfsMapping, null, 2));

  console.log(`\n💾 IPFS mapping saved to: favicons/ipfs-mapping.json`);

  // Summary
  const total = files.length;
  const uploaded = Object.keys(ipfsMapping).length;
  const failed = total - uploaded;

  console.log(`\n📊 Summary:`);
  console.log(`   Total files: ${total}`);
  console.log(`   ✅ Uploaded: ${uploaded}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n✅ Next step: Run 'pnpm seed:test' or 'pnpm seed:full' to create atoms\n`);
}

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
