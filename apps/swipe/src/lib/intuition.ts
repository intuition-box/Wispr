import type { Profile } from "@wispr/ontology";
import type { WalletConnection } from "@/hooks/useWalletConnection";

/**
 * Publish a user profile as Intuition triples on-chain.
 *
 * Creates atoms for the user address, role, and AI level,
 * then creates two triples:
 *   [user] --has role--> [role]
 *   [user] --has AI level--> [level]
 *
 * Returns the transaction hash of the last triple creation.
 */
export async function publishProfile(
  wallet: WalletConnection,
  profile: Profile
): Promise<{ txHash: string; explorerUrl: string }> {
  const { ethers } = await import("ethers");
  const { multiVault, address } = wallet;

  const encoder = new TextEncoder();

  // Get costs
  const atomCost: bigint = await multiVault.getAtomCost();
  const tripleCost: bigint = await multiVault.getTripleCost();

  // Create atoms
  const userAtomData = encoder.encode(address.toLowerCase());
  const roleAtomData = encoder.encode(`wispr:role:${profile.role}`);
  const levelAtomData = encoder.encode(`wispr:ai-level:${profile.level}`);
  const predicateRoleData = encoder.encode("wispr:has-role");
  const predicateLevelData = encoder.encode("wispr:has-ai-level");

  // Batch create all 5 atoms
  const atomTx1 = await multiVault.createAtom(userAtomData, { value: atomCost });
  await atomTx1.wait();

  const atomTx2 = await multiVault.createAtom(roleAtomData, { value: atomCost });
  await atomTx2.wait();

  const atomTx3 = await multiVault.createAtom(levelAtomData, { value: atomCost });
  await atomTx3.wait();

  const atomTx4 = await multiVault.createAtom(predicateRoleData, { value: atomCost });
  await atomTx4.wait();

  const atomTx5 = await multiVault.createAtom(predicateLevelData, { value: atomCost });
  await atomTx5.wait();

  // Calculate atom IDs for triple creation
  const userAtomId = BigInt(
    ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["bytes"], [userAtomData]))
  );
  const roleAtomId = BigInt(
    ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["bytes"], [roleAtomData]))
  );
  const levelAtomId = BigInt(
    ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["bytes"], [levelAtomData]))
  );
  const predicateRoleId = BigInt(
    ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["bytes"], [predicateRoleData]))
  );
  const predicateLevelId = BigInt(
    ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["bytes"], [predicateLevelData]))
  );

  // Create triples: [user] --has role--> [role]
  const tripleTx1 = await multiVault.createTriple(
    userAtomId,
    predicateRoleId,
    roleAtomId,
    { value: tripleCost }
  );
  await tripleTx1.wait();

  // Create triple: [user] --has AI level--> [level]
  const tripleTx2 = await multiVault.createTriple(
    userAtomId,
    predicateLevelId,
    levelAtomId,
    { value: tripleCost }
  );
  const receipt = await tripleTx2.wait();

  const txHash = receipt.hash;
  return {
    txHash,
    explorerUrl: `https://explorer.intuition.systems/tx/${txHash}`,
  };
}
