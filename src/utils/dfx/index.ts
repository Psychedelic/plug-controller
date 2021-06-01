import { HttpAgent, Actor, ActorSubclass, Principal } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import fetch from "cross-fetch";
import { config } from 'dotenv';

import WalletService from '../../interfaces/wallet';
import ledgerIDLFactory from '../../idls/ledger.did';

if (process.env.NODE_ENV !== 'production') config();

export const createAgent = async (secretKey: Uint8Array) => {
    const identity = secretKey 
        ? Ed25519KeyIdentity.fromSecretKey(secretKey) 
        : Ed25519KeyIdentity.generate();
    const agent = await Promise.resolve(
        new HttpAgent({ host: process.env.DFX_HOST || 'https://ic0.app', fetch, identity })
        ).then(async (agent) => {
        await agent.fetchRootKey();
        return agent;
        });
    return { agent, identity };
}

export const getLedgerActor = async (secretKey: Uint8Array) => {
    const { agent, identity } = await createAgent(secretKey)
  
    const actor = Actor.createActor<ActorSubclass<WalletService>>(
      ledgerIDLFactory,
      { agent, canisterId: process.env.LEDGER_CANISTER_ID! }
    );
  
    console.log("principal id", identity.getPrincipal().toText());
  
    actor.wallet_balance().then((res) => {
      console.log("wallet balanace", res);
  
      actor
        .wallet_call({
          canister: Principal.fromText("bqdjp-7iaaa-aaaad-qabgq-cai"),
          method_name: "canister_status",
          cycles: 0 as unknown as bigint,
          args: [],
        })
        .then(console.log);
    });
  };