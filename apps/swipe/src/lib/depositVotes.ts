import type { WalletConnection } from "@/hooks/useWalletConnection";
import {
  TYPE_ATOM_IDS,
  IS_BEST_OF_ATOM_ID,
  IN_CONTEXT_OF_ATOM_ID,
} from "@/data/componentCatalog";
import type { ComponentInfo, UseCase } from "@/data/componentCatalog";

export type Vote = {
  component: ComponentInfo & { typeEmoji: string };
  direction: "for" | "against";
};

/**
 * Batch-deposit votes into nested Intuition triple vaults.
 *
 * For each "for" vote, deposits into the nested triple:
 *   (component is-best-of type) in-context-of context
 *
 * For each "against" vote, deposits into its counter-triple.
 *
 * Creates any missing base or nested triples before depositing.
 */
export async function depositVotes(
  wallet: WalletConnection,
  votes: Vote[],
  useCase: UseCase
): Promise<{ txHash: string; explorerUrl: string }> {
  const { multiVault, address } = wallet;

  if (votes.length === 0) throw new Error("No votes to submit");

  // Get costs and curve config
  const [bondingConfig, tripleCost, atomCost] = await Promise.all([
    multiVault.getBondingCurveConfig(),
    multiVault.getTripleCost(),
    multiVault.getAtomCost(),
  ]);
  const defaultCurveId: bigint = bondingConfig[1];

  // --- Step 1: Compute all base triple IDs and check existence ---
  const baseTripleData: {
    vote: Vote;
    baseTripleId: string;
    baseExists: boolean;
    componentAtomId: string;
    typeAtomId: string;
  }[] = [];

  for (const vote of votes) {
    const typeAtomId = TYPE_ATOM_IDS[vote.component.type];
    if (!typeAtomId) continue;

    const baseTripleId: string = await multiVault.calculateTripleId(
      vote.component.atomId,
      IS_BEST_OF_ATOM_ID,
      typeAtomId
    );
    const baseExists: boolean = await multiVault.isTermCreated(baseTripleId);

    baseTripleData.push({
      vote,
      baseTripleId,
      baseExists,
      componentAtomId: vote.component.atomId,
      typeAtomId,
    });
  }

  // --- Step 2: Create missing base triples ---
  const missingBase = baseTripleData.filter((d) => !d.baseExists);
  if (missingBase.length > 0) {
    const totalCost = (tripleCost as bigint) * BigInt(missingBase.length);
    const tx = await multiVault.createTriples(
      missingBase.map((d) => d.componentAtomId),
      missingBase.map(() => IS_BEST_OF_ATOM_ID),
      missingBase.map((d) => d.typeAtomId),
      missingBase.map(() => tripleCost),
      { value: totalCost }
    );
    await tx.wait();
    // Mark as existing
    for (const d of missingBase) d.baseExists = true;
  }

  // --- Step 3: Compute nested triple IDs and check existence ---
  const nestedTripleData: {
    vote: Vote;
    nestedTripleId: string;
    nestedExists: boolean;
    baseTripleId: string;
  }[] = [];

  for (const d of baseTripleData) {
    const nestedTripleId: string = await multiVault.calculateTripleId(
      d.baseTripleId,
      IN_CONTEXT_OF_ATOM_ID,
      useCase.atomId
    );
    const nestedExists: boolean = await multiVault.isTermCreated(nestedTripleId);

    nestedTripleData.push({
      vote: d.vote,
      nestedTripleId,
      nestedExists,
      baseTripleId: d.baseTripleId,
    });
  }

  // --- Step 4: Create missing nested triples ---
  const missingNested = nestedTripleData.filter((d) => !d.nestedExists);
  if (missingNested.length > 0) {
    const totalCost = (tripleCost as bigint) * BigInt(missingNested.length);
    const tx = await multiVault.createTriples(
      missingNested.map((d) => d.baseTripleId),
      missingNested.map(() => IN_CONTEXT_OF_ATOM_ID),
      missingNested.map(() => useCase.atomId),
      missingNested.map(() => tripleCost),
      { value: totalCost }
    );
    await tx.wait();
  }

  // --- Step 5: Batch deposit into nested triple vaults ---
  const termIds: string[] = [];
  const curveIds: bigint[] = [];
  const assets: bigint[] = [];
  const minShares: bigint[] = [];

  for (const d of nestedTripleData) {
    let depositTermId = d.nestedTripleId;
    if (d.vote.direction === "against") {
      depositTermId = await multiVault.getCounterIdFromTripleId(d.nestedTripleId);
    }
    termIds.push(depositTermId);
    curveIds.push(defaultCurveId);
    assets.push(atomCost as bigint);
    minShares.push(0n);
  }

  const totalValue = assets.reduce((sum, a) => sum + a, 0n);

  const tx = await multiVault.depositBatch(
    address,
    termIds,
    curveIds,
    assets,
    minShares,
    { value: totalValue }
  );

  const receipt = await tx.wait();
  const txHash = receipt.hash;

  return {
    txHash,
    explorerUrl: `https://explorer.intuition.systems/tx/${txHash}`,
  };
}
