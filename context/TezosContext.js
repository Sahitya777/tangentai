import React, { createContext, useEffect } from "react";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import config from "./config";

let wallet, tezos;
if (typeof window != undefined) {
  wallet = new BeaconWallet({
    name: "TangentAI",
    preferredNetwork: "ghostnet",
  });
  tezos = new TezosToolkit(config.GHOSTNET_RPC);
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
