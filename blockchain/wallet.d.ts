export declare function SuiProviders({ children }: {
    children: any;
}): import("react/jsx-runtime").JSX.Element;
export declare function useSlushWallet(): {
    currentAccount: import("@wallet-standard/core").WalletAccount;
    connectSlush: (callbacks?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
    }) => void;
    disconnectWallet: import("@tanstack/react-query").UseMutateFunction<void, Error | import("@mysten/dapp-kit/dist/cjs/errors/walletErrors").WalletNotConnectedError, void, unknown>;
    isConnecting: boolean;
    isDisconnecting: boolean;
};
