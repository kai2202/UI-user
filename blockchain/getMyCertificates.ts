import type { SuiObjectData } from "@mysten/sui.js/client";
import { suiClient } from "./suiClient";
import { PACKAGE_ID, MODULE_NAME } from "./constants";

const CERT_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::Certificate`;

export type Certificate = {
  objectId: string;
  courseId: string;
  issuer: string;
  issuedAt: string | number;
};

const toCertificate = (obj?: SuiObjectData | null): Certificate | null => {
  const content = obj?.content;
  if (!content || content.dataType !== "moveObject" || content.type !== CERT_TYPE) return null;

  const fields = content.fields as Record<string, any>;
  return {
    objectId: obj.objectId,
    courseId: fields.course_id?.toString?.() ?? "",
    issuer: fields.issuer?.toString?.() ?? "",
    issuedAt: fields.issued_at ?? "",
  };
};

export const getMyCertificates = async (walletAddress: string): Promise<Certificate[]> => {
  const owned = await suiClient.getOwnedObjects({
    owner: walletAddress,
    filter: { StructType: CERT_TYPE },
    options: { showContent: true },
  });

  return (owned.data ?? [])
    .map(({ data }): Certificate | null => toCertificate(data ?? undefined))
    .filter((item): item is Certificate => Boolean(item));
};
