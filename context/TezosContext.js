import React, { createContext, useEffect } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import config from "./config";

let wallet, tezos;
if (typeof window !== "undefined") {
  wallet = new BeaconWallet({
    name: "TangentAI",
    preferredNetwork: "mainnet",
  });
  tezos = new TezosToolkit(config.MAINNET_RPC);
  tezos.setProvider({ wallet });
}

export const TezosContext = createContext();
export const TezosProvider = ({ children }) => {
  return (
    <TezosContext.Provider value={{ wallet, tezos }}>
      {children}
    </TezosContext.Provider>
  );
};
