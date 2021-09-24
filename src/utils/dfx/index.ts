/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import fetch from 'cross-fetch';
import { HttpAgent } from '@dfinity/agent';
import { Secp256k1KeyIdentity } from '@dfinity/identity';

// import TokenService from '../../interfaces/token';
import { IC_HOST } from './constants';

export interface CreateAgentArgs {
  secretKey: ArrayBuffer;
  defaultIdentity?: Secp256k1KeyIdentity;
}

export const createIdentity = (secretKey: ArrayBuffer): Secp256k1KeyIdentity =>
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

export { createLedgerActor } from './ledger';
export { createNNSActor } from './nns_uid';
