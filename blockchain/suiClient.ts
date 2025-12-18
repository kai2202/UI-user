import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { networkConfig } from "./networkConfig";

// Centralized Sui client configured for testnet only.
const DEFAULT_NETWORK = "testnet" as const;

const resolveRpcUrl = (): string => {
  // Prefer the configured testnet RPC; fall back to the official endpoint if missing.
  const rpcFromConfig = networkConfig?.[DEFAULT_NETWORK]?.url;
  return rpcFromConfig ?? getFullnodeUrl(DEFAULT_NETWORK);
};

export const suiClient = new SuiClient({
  url: resolveRpcUrl(),
});

export type SupportedNetwork = typeof DEFAULT_NETWORK;
