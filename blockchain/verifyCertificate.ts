import { suiClient } from "./suiClient";
import { PACKAGE_ID, MODULE_NAME } from "./constants";
import { ADMIN_ALLOWLIST } from "./roles";

const CERT_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::Certificate`;

export type VerificationResult = {
  valid: boolean;
  courseId?: string;
  issuer?: string;
};

const normalize = (address?: string): string | undefined => address?.trim().toLowerCase();

export const verifyCertificate = async (objectId: string): Promise<VerificationResult> => {
  const object = await suiClient.getObject({
    id: objectId,
    options: { showContent: true },
  });

  const content = object.data?.content;
  if (!content || content.dataType !== "moveObject" || content.type !== CERT_TYPE) {
    return { valid: false };
  }

  const fields = content.fields as Record<string, any>;
  const issuer = fields.issuer?.toString?.();
  const courseId = fields.course_id?.toString?.();

  const isIssuerAllowed = ADMIN_ALLOWLIST.has(normalize(issuer) ?? "");
  const valid = Boolean(isIssuerAllowed && issuer && courseId);

  return {
    valid,
    courseId,
    issuer,
  };
};
