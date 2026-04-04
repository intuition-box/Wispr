#!/usr/bin/env node
/**
 * Step 1: Download all favicons needed for the ontology
 *
 * This script:
 * - Reads the ontology JSON
 * - Determines the correct favicon domain for each component
 * - Downloads favicons to packages/ontology/favicons/
 *
 * Usage:
 *   pnpm --filter @wispr/ontology download:favicons
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";

// Atom definition
interface AtomData {
  id: string;
  name: string;
  description: string;
  url?: string;
}

// Load ontology data
const ONTOLOGY_PATH = resolve(process.cwd(), "../../plans/ontology-foundation-w4-p3.json");
const ontology = JSON.parse(readFileSync(ONTOLOGY_PATH, "utf-8"));

// Create favicons directory
const FAVICONS_DIR = resolve(process.cwd(), "favicons");
if (!existsSync(FAVICONS_DIR)) {
  mkdirSync(FAVICONS_DIR, { recursive: true });
}

// Helper: Extract the correct domain for the favicon
function getFaviconDomain(atom: AtomData): string | null {
  // Special case: MCPs should use the service they integrate with
  if (atom.name.toLowerCase().startsWith("mcp ")) {
    const serviceName = atom.name.toLowerCase().replace("mcp ", "").trim();

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

// Helper: Download favicon from Google's service
async function downloadFavicon(domain: string, atomId: string): Promise<boolean> {
  try {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
    const response = await fetch(faviconUrl);

    if (!response.ok) {
      console.error(`   ❌ Failed to fetch: ${response.statusText}`);
      return false;
    }

    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    // Save to file
    const filePath = resolve(FAVICONS_DIR, `${atomId}.png`);
    writeFileSync(filePath, buffer);

    console.log(`   ✅ Saved to favicons/${atomId}.png (${buffer.length} bytes)`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log("📥 Wispear Ontology - Download Favicons\n");

  // Filter only components (atoms with URLs)
  const components = ontology.atoms.filter((atom: AtomData) => atom.url);

  console.log(`📝 Found ${components.length} components with URLs\n`);

  const faviconMapping: Record<string, { domain: string; downloaded: boolean }> = {};

  for (const atom of components) {
    const domain = getFaviconDomain(atom);

    console.log(`[${atom.id}] ${atom.name}`);
    console.log(`   🌐 Domain: ${domain || "none"}`);

    if (!domain) {
      console.log(`   ⚠️  Skipping (no domain)\n`);
      faviconMapping[atom.id] = { domain: "", downloaded: false };
      continue;
    }

    const downloaded = await downloadFavicon(domain, atom.id);
    faviconMapping[atom.id] = { domain, downloaded };
    console.log("");
  }

  // Save mapping to JSON
  const mappingPath = resolve(FAVICONS_DIR, "favicon-mapping.json");
  writeFileSync(mappingPath, JSON.stringify(faviconMapping, null, 2));

  console.log(`\n💾 Favicon mapping saved to: favicons/favicon-mapping.json`);

  // Summary
  const total = Object.keys(faviconMapping).length;
  const downloaded = Object.values(faviconMapping).filter((m) => m.downloaded).length;
  const skipped = total - downloaded;

  console.log(`\n📊 Summary:`);
  console.log(`   Total components: ${total}`);
  console.log(`   ✅ Downloaded: ${downloaded}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`\n✅ Next step: Run 'pnpm upload:favicons' to upload to Pinata IPFS\n`);
}

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
