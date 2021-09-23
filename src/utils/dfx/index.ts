/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import fetch from 'cross-fetch';
import { HttpAgent } from '@dfinity/agent';
import { BinaryBlob, blobFromUint8Array } from '@dfinity/candid';

// import TokenService from '../../interfaces/token';
import { IC_HOST } from './constants';
import Secp256k1KeyIdentity from '../crypto/secpk256k1/identity';

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

export { createLedgerActor } from './ledger';
export { createNNSActor } from './nns_uid';
