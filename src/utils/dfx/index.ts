/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { HttpAgent } from '@dfinity/agent';
import { BinaryBlob, blobFromUint8Array } from '@dfinity/candid';
import crossFetch from 'cross-fetch';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';
import { wrappedFetch } from './wrappedFetch';

// import TokenService from '../../interfaces/token';
import { PLUG_PROXY_HOST } from './constants';

export interface CreateAgentArgs {
  secretKey: BinaryBlob;
  defaultIdentity?: Secp256k1KeyIdentity;
  fetch?: any;
  host?: string;
  wrapped?: boolean,
}

export const createIdentity = (secretKey: BinaryBlob): Secp256k1KeyIdentity =>
  Secp256k1KeyIdentity.fromSecretKey(secretKey);

export const createAgent = ({
  secretKey,
  defaultIdentity,
  fetch = crossFetch,
  host,
  wrapped = true,
}: CreateAgentArgs): HttpAgent => {
  const identity =
    defaultIdentity || createIdentity(blobFromUint8Array(secretKey));
  const agent = new HttpAgent({
    host: host || PLUG_PROXY_HOST,
    fetch: wrapped ?  wrappedFetch(fetch) : fetch,
    identity,
  });
  return agent;
};

export { createNNSActor } from './nns_uid';
