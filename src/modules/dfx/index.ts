import { HttpAgent, Actor, ActorSubclass, Principal } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import fetch from "cross-fetch";
import { config } from 'dotenv';

import LedgerService from '../../interfaces/ledger';
import ledgerIDLFactory from '../../idls/ledger.did';

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
        new HttpAgent({ host: process.env.DFX_HOST || 'https://ic0.app', fetch, identity })
        ).then(async (agent) => {
        await agent.fetchRootKey();
        return agent;
        });
    return agent
}

export const getLedgerActor = async (secretKey: Uint8Array) => {
    const agent = await createAgent({ secretKey })

    const actor = Actor.createActor<ActorSubclass<LedgerService>>(
      ledgerIDLFactory,
      { agent, canisterId: process.env.LEDGER_CANISTER_ID! }
    );
    return actor;
  };