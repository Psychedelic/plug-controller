/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { HttpAgent, Actor, ActorSubclass } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import fetch from 'cross-fetch';
import { config } from 'dotenv';

import walletIDLFactory from '../../idls/walltet';
import WalletService from '../../interfaces/wallet';
import { IC_HOST } from './constants';

if (process.env.NODE_ENV !== 'production') config();

export interface CreateAgentArgs {
  secretKey: Uint8Array;
  defaultIdentity?: Ed25519KeyIdentity;
}

export const createIdentity = (secretKey?: Uint8Array): Ed25519KeyIdentity =>
  secretKey
    ? Ed25519KeyIdentity.fromSecretKey(secretKey)
    : Ed25519KeyIdentity.generate();

export const createAgent = async ({
  secretKey,
  defaultIdentity,
}: CreateAgentArgs): Promise<HttpAgent> => {
  const identity = defaultIdentity || createIdentity(secretKey);
  const agent = await Promise.resolve(
    new HttpAgent({ host: process.env.DFX_HOST || IC_HOST, fetch, identity })
  ).then(async ag => {
    await ag.fetchRootKey();
    return ag;
  });
  return agent;
};

export const getCyclesWalletActor = async (
  canisterId: string,
  secretKey: Uint8Array
): Promise<ActorSubclass<WalletService>> => {
  const agent = await createAgent({ secretKey });
  const actor = Actor.createActor<ActorSubclass<WalletService>>(
    walletIDLFactory,
    { agent, canisterId }
  );
  return actor;
};

export { createLedgerActor } from './ledger';
export { createNNSActor } from './nns_uid';
