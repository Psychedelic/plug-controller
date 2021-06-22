import { HttpAgent, Actor, ActorSubclass, Principal } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import fetch from "cross-fetch";
import { config } from 'dotenv';

import LedgerService from '../../interfaces/ledger';
import ledgerIDLFactory from '../../idls/ledger.did';
import walletIDLFactory from "../../idls/walltet";
import WalletService from "../../interfaces/wallet";
import { IC_HOST, LEDGER_CANISTER_ID } from "./constants";

if (process.env.NODE_ENV !== 'production') config();

export interface CreateAgentArgs {
  secretKey: Uint8Array,
  defaultIdentity?: Ed25519KeyIdentity
}

export const createIdentity = (secretKey?: Uint8Array) => 
  secretKey 
    ? Ed25519KeyIdentity.fromSecretKey(secretKey) 
    : Ed25519KeyIdentity.generate();

export const createAgent = async ({ secretKey, defaultIdentity }: CreateAgentArgs) => {
    const identity = defaultIdentity || createIdentity(secretKey);
    const agent = await Promise.resolve(
        new HttpAgent({ host: process.env.DFX_HOST || IC_HOST, fetch, identity })
        ).then(async (agent) => {
        await agent.fetchRootKey();
        return agent;
        });
    return agent
}

export const getLedgerActor = async (secretKey: Uint8Array) => {
    const agent = await createAgent({ secretKey });
    const actor = Actor.createActor<ActorSubclass<LedgerService>>(
      ledgerIDLFactory,
      { agent, canisterId: LEDGER_CANISTER_ID }
    );
    return actor;
  };

export const getWalletActor = async (canisterId: string, secretKey: Uint8Array) => {
    const agent = await createAgent({ secretKey });
    const actor = Actor.createActor<ActorSubclass<WalletService>>(
      walletIDLFactory,
      { agent, canisterId }
    );
    return actor;
}