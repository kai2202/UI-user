const normalize = (address?: string): string | undefined => address?.trim().toLowerCase();

// TODO: Replace with real admin Sui addresses as they are onboarded.
export const ADMIN_ALLOWLIST: Set<string> = new Set([
  // "0xadminaddress",
]);

export const isAdmin = (address?: string): boolean => {
  const normalized = normalize(address);
  return normalized ? ADMIN_ALLOWLIST.has(normalized) : false;
};
