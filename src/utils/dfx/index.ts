/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { HttpAgent } from '@dfinity/agent';
import crossFetch from 'cross-fetch';
import { Secp256k1KeyIdentity } from '@dfinity/identity';
import { wrappedFetch } from './wrappedFetch';

// import TokenService from '../../interfaces/token';
import { PLUG_PROXY_HOST } from './constants';

export interface CreateAgentArgs {
  secretKey: ArrayBuffer;
  defaultIdentity?: Secp256k1KeyIdentity;
  fetch?: any;
}

export const createIdentity = (secretKey: ArrayBuffer): Secp256k1KeyIdentity =>
  Secp256k1KeyIdentity.fromSecretKey(secretKey);

export const createAgent = async ({
  secretKey,
  defaultIdentity,
  fetch = crossFetch,
}: CreateAgentArgs): Promise<HttpAgent> => {
  const identity = defaultIdentity || createIdentity(secretKey);
  const agent = await Promise.resolve(
    new HttpAgent({
      host: process.env.DFX_HOST || PLUG_PROXY_HOST,
      fetch: wrappedFetch(fetch),
      identity,
    })
  ).then(async ag => {
    await ag.fetchRootKey();
    return ag;
  });
  return agent;
};

export { createLedgerActor } from './ledger';
export { createNNSActor } from './nns_uid';
