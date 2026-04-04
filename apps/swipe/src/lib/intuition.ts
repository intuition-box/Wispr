import type { Profile } from "@wispr/ontology";
import type { WalletConnection } from "@/hooks/useWalletConnection";

/**
 * Publish a user profile as Intuition triples on-chain (V2 batch API).
 *
 * Creates atoms for the user address, role, AI level, and predicates,
 * then creates two triples:
 *   [user] --has role--> [role]
 *   [user] --has AI level--> [level]
 */
export async function publishProfile(
  wallet: WalletConnection,
  profile: Profile
): Promise<{ txHash: string; explorerUrl: string }> {
  const { ethers } = await import("ethers");
  const { multiVault, address } = wallet;

  // Get costs
  const atomCost: bigint = await multiVault.getAtomCost();
  const tripleCost: bigint = await multiVault.getTripleCost();

  // Prepare atom data as hex-encoded bytes
  const toHex = (s: string) => ethers.hexlify(ethers.toUtf8Bytes(s));

  const atomDatas = [
    toHex(address.toLowerCase()),
    toHex(`wispr:role:${profile.role}`),
    toHex(`wispr:ai-level:${profile.level}`),
    toHex("wispr:has-role"),
    toHex("wispr:has-ai-level"),
  ];

  // Check which atoms already exist, only create missing ones
  const atomIds: string[] = [];
  const toCreate: string[] = [];
  const toCreateAssets: bigint[] = [];

  for (const data of atomDatas) {
    const atomId: string = await multiVault.calculateAtomId(data);
    atomIds.push(atomId);
    const exists: boolean = await multiVault.isTermCreated(atomId);
    if (!exists) {
      toCreate.push(data);
      toCreateAssets.push(atomCost);
    }
  }

  // Batch create missing atoms
  if (toCreate.length > 0) {
    const totalAtomCost = atomCost * BigInt(toCreate.length);
    const atomTx = await multiVault.createAtoms(toCreate, toCreateAssets, {
      value: totalAtomCost,
    });
    await atomTx.wait();
  }

  const [userAtomId, roleAtomId, levelAtomId, predicateRoleId, predicateLevelId] = atomIds;

  // Check which triples need to be created
  const tripleDefs = [
    { subject: userAtomId, predicate: predicateRoleId, object: roleAtomId },
    { subject: userAtomId, predicate: predicateLevelId, object: levelAtomId },
  ];

  const triplesToCreate: typeof tripleDefs = [];
  for (const t of tripleDefs) {
    const tripleId: string = await multiVault.calculateTripleId(t.subject, t.predicate, t.object);
    const exists: boolean = await multiVault.isTermCreated(tripleId);
    if (!exists) triplesToCreate.push(t);
  }

  if (triplesToCreate.length === 0) {
    // Everything already published — return a no-op result
    return {
      txHash: "0x0",
      explorerUrl: `https://explorer.intuition.systems/address/${address}`,
    };
  }

  const totalTripleCost = tripleCost * BigInt(triplesToCreate.length);
  const tripleTx = await multiVault.createTriples(
    triplesToCreate.map((t) => t.subject),
    triplesToCreate.map((t) => t.predicate),
    triplesToCreate.map((t) => t.object),
    triplesToCreate.map(() => tripleCost),
    { value: totalTripleCost }
  );
  const receipt = await tripleTx.wait();

  const txHash = receipt.hash;
  return {
    txHash,
    explorerUrl: `https://explorer.intuition.systems/tx/${txHash}`,
  };
}
