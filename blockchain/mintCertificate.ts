import { TransactionBlock } from "@mysten/sui.js/transactions";
import type { SuiTransactionBlockResponse } from "@mysten/sui.js/client";
import { PACKAGE_ID, MODULE_NAME } from "./constants";

const MINT_TARGET = `${PACKAGE_ID}::${MODULE_NAME}::mint_certificate` as const;

type SignAndExecute = (args: {
  transactionBlock: TransactionBlock;
  options?: {
    showEffects?: boolean;
    showObjectChanges?: boolean;
    showEvents?: boolean;
  };
}) => Promise<SuiTransactionBlockResponse>;

export type MintCertificateInput = {
  signAndExecuteTransactionBlock: SignAndExecute;
  recipientWallet: string;
  courseId: string;
  metadataHash: string;
};

export type MintCertificateResult = {
  transactionDigest: string;
  objectId?: string;
};

export const mintCertificate = async ({
  signAndExecuteTransactionBlock,
  recipientWallet,
  courseId,
  metadataHash,
}: MintCertificateInput): Promise<MintCertificateResult> => {
  const txb = new TransactionBlock();

  txb.moveCall({
    target: MINT_TARGET,
    arguments: [
      txb.pure.address(recipientWallet),
      txb.pure.string(courseId),
      txb.pure.string(metadataHash),
    ],
  });

  const response = await signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });

  const objectIdFromEffects = response.effects?.created?.[0]?.reference?.objectId;

  return {
    transactionDigest: response.digest,
    objectId: objectIdFromEffects,
  };
};
