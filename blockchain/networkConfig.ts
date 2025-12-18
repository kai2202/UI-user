import { getFullnodeUrl } from "@mysten/sui.js/client";
import { TESTNET_HELLO_WORLD_PACKAGE_ID } from "./constants";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        helloWorldPackageId: TESTNET_HELLO_WORLD_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
