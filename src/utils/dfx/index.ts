/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { AnonymousIdentity, HttpAgent } from '@dfinity/agent';
import { BinaryBlob, blobFromUint8Array } from '@dfinity/candid';
import crossFetch from 'cross-fetch';

import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';
import { wrappedFetch } from './wrappedFetch';
import { IC_MAINNET_URLS, PLUG_PROXY_HOST } from './constants';
import { SignIdentity } from '@dfinity/agent';
import { ERRORS } from '../../errors';

export interface CreateAgentArgs {
  secretKey?: BinaryBlob;
  defaultIdentity?: SignIdentity;
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
  if (!defaultIdentity && !secretKey) throw new Error(ERRORS.EMPTY_IDENTITY_ERROR);
  const identity =
    defaultIdentity || (secretKey ? createIdentity(blobFromUint8Array(secretKey)) : new AnonymousIdentity() );
  const agent = new HttpAgent({
    host: (wrapped ? PLUG_PROXY_HOST : host)|| PLUG_PROXY_HOST,
    fetch: wrapped ?  wrappedFetch(fetch) : fetch,
    identity,
  });
  if (host && !IC_MAINNET_URLS.includes(host)) {
    agent.fetchRootKey();
  }
  return agent;
};

export { createNNSActor } from './nns_uid';
