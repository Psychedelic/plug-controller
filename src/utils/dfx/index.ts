/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import fetch from 'cross-fetch';
import { config } from 'dotenv';
import { HttpAgent, Actor, ActorSubclass } from '@dfinity/agent';

import walletIDLFactory from '../../idls/walltet';
import WalletService from '../../interfaces/wallet';
import { IC_HOST } from './constants';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';

if (process.env.NODE_ENV !== 'production') config();

export interface CreateAgentArgs {
  secretKey: Uint8Array;
  defaultIdentity?: Secp256k1KeyIdentity;
}

export const createIdentity = (secretKey: Uint8Array): Secp256k1KeyIdentity =>
  Secp256k1KeyIdentity.fromSecretKey(secretKey);

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
