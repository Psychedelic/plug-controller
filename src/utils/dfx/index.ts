/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import fetch from 'cross-fetch';
import { config } from 'dotenv';
import { HttpAgent, Actor, ActorSubclass } from '@dfinity/agent';
import { BinaryBlob, blobFromUint8Array } from '@dfinity/candid';

import tokenIDLFactory from '../../idls/token.did';
import TokenService from '../../interfaces/token';
import { IC_HOST } from './constants';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';

if (process.env.NODE_ENV !== 'production') config();

export interface CreateAgentArgs {
  secretKey: Uint8Array;
  defaultIdentity?: Secp256k1KeyIdentity;
}

export const createIdentity = (secretKey: BinaryBlob): Secp256k1KeyIdentity =>
  Secp256k1KeyIdentity.fromSecretKey(secretKey);

export const createAgent = async ({
  secretKey,
  defaultIdentity,
}: CreateAgentArgs): Promise<HttpAgent> => {
  const identity =
    defaultIdentity || createIdentity(blobFromUint8Array(secretKey));
  const agent = await Promise.resolve(
    new HttpAgent({ host: process.env.DFX_HOST || IC_HOST, fetch, identity })
  ).then(async ag => {
    await ag.fetchRootKey();
    return ag;
  });
  return agent;
};

export const createTokenActor = async (
  canisterId: string,
  secretKey: Uint8Array
): Promise<ActorSubclass<TokenService>> => {
  const agent = await createAgent({ secretKey });
  const actor = Actor.createActor<ActorSubclass<TokenService>>(
    tokenIDLFactory,
    { agent, canisterId }
  );
  return actor;
};

export { createLedgerActor } from './ledger';
export { createNNSActor } from './nns_uid';
