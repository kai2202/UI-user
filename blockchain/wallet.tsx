import React, { useCallback, useMemo } from "react";
import {
  SuiClientProvider,
  WalletProvider,
  useConnectWallet,
  useCurrentAccount,
  useWallets,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { networkConfig } from "./networkConfig";

const queryClient = new QueryClient();

export function SuiProviders({ children }: { children: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect preferredWallets={["Slush"]}>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export function useSlushWallet() {
  const { mutate: connect, isPending } = useConnectWallet();
  const { mutate: disconnectWallet, isPending: isDisconnecting } = useDisconnectWallet();
  const wallets = useWallets();
  const currentAccount = useCurrentAccount();

  const slushWallet = useMemo(
    () => wallets.find((wallet) => wallet.name.toLowerCase().includes("slush")),
    [wallets],
  );

  const connectSlush = useCallback(
    (callbacks?: { onSuccess?: () => void; onError?: (error: Error) => void }) => {
      const targetWallet = slushWallet ?? wallets[0];

      if (!targetWallet) {
        callbacks?.onError?.(new Error("No Sui-compatible wallets detected"));
        return;
      }

      connect(
        { wallet: targetWallet },
        {
          onSuccess: () => callbacks?.onSuccess?.(),
          onError: (error) => callbacks?.onError?.(error),
        },
      );
    },
    [connect, slushWallet, wallets],
  );

  return {
    currentAccount,
    connectSlush,
    disconnectWallet,
    isConnecting: isPending,
    isDisconnecting,
  };
}
