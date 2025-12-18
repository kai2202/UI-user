declare const networkConfig: {
    readonly testnet: {
        readonly url: "https://fullnode.mainnet.sui.io:443" | "https://fullnode.testnet.sui.io:443" | "https://fullnode.devnet.sui.io:443" | "http://127.0.0.1:9000";
        readonly variables: {
            readonly helloWorldPackageId: "0x0de8f0a090b81b642d62f6ad9459f2e1cad737bf51d6a3584f5082a91ee3f90c";
        };
    };
}, useNetworkVariable: <K extends "helloWorldPackageId">(name: K) => {
    readonly helloWorldPackageId: "0x0de8f0a090b81b642d62f6ad9459f2e1cad737bf51d6a3584f5082a91ee3f90c";
}[K], useNetworkVariables: () => {
    readonly helloWorldPackageId: "0x0de8f0a090b81b642d62f6ad9459f2e1cad737bf51d6a3584f5082a91ee3f90c";
};
export { useNetworkVariable, useNetworkVariables, networkConfig };
