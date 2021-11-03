/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import fetch from 'cross-fetch';
import { HttpAgent } from '@dfinity/agent';
import { BinaryBlob, blobFromUint8Array } from '@dfinity/candid';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';

// import TokenService from '../../interfaces/token';
import { IC_URL_HOST, PLUG_PROXY_HOST } from './constants';

export interface CreateAgentArgs {
  secretKey: BinaryBlob;
  defaultIdentity?: Secp256k1KeyIdentity;
}

export const createIdentity = (secretKey: BinaryBlob): Secp256k1KeyIdentity =>
  Secp256k1KeyIdentity.fromSecretKey(secretKey);

let use_ic_url = false;

/* eslint-disable no-param-reassign */
const wrappedFetchInternal = (resolve, reject, resource, ...initArgs): void => {
  if (use_ic_url) {
    resource = new URL(resource);
    resource.host = IC_URL_HOST;
  }
  console.log('fetching', resource);
  fetch(resource, ...initArgs)
    .then(r => {
      if (!use_ic_url && r.headers['x-unavailable']) {
        use_ic_url = true;
        wrappedFetchInternal(resolve, reject, resource, ...initArgs);
        return;
      }
      resolve(r);
    })
    .catch(e => {
      reject(e);
    });
};

export const wrappedFetch = (
  ...args: Parameters<typeof fetch>
): Promise<Response> => {
  let reject;
  let resolve;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  wrappedFetchInternal(resolve, reject, ...args);

  return promise as Promise<Response>;
};

export const createAgent = async ({
  secretKey,
  defaultIdentity,
}: CreateAgentArgs): Promise<HttpAgent> => {
  const identity =
    defaultIdentity || createIdentity(blobFromUint8Array(secretKey));
  const agent = await Promise.resolve(
    new HttpAgent({
      host: process.env.DFX_HOST || PLUG_PROXY_HOST,
      fetch: wrappedFetch,
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
