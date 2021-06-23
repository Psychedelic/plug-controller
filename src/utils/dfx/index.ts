/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { HttpAgent, Actor, ActorSubclass } from '@dfinity/agent';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import fetch from 'cross-fetch';
import { config } from 'dotenv';
import RandomBigInt from 'random-bigint';

import LedgerService, { TimeStamp } from '../../interfaces/ledger';
import ledgerIDLFactory from '../../idls/ledger.did';
import walletIDLFactory from '../../idls/walltet';
import WalletService from '../../interfaces/wallet';
import { IC_HOST, LEDGER_CANISTER_ID } from './constants';

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

export const getLedgerActor = async (
  secretKey: Uint8Array
): Promise<ActorSubclass<LedgerService>> => {
  const agent = await createAgent({ secretKey });
  const actor = Actor.createActor<ActorSubclass<LedgerService>>(
    ledgerIDLFactory,
    { agent, canisterId: LEDGER_CANISTER_ID }
  );
  return actor;
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

interface SendOpts {
  fee?: bigint;
  memo?: bigint;
  from_subaccount?: number;
  created_at_time?: TimeStamp; // TODO: create js Date to TimeStamp function
}

const defaultArgs = {
  fee: BigInt(10000),
  memo: RandomBigInt(32),
};

export const sendICP = async (
  secretKey: Uint8Array,
  to: string,
  amount: bigint,
  opts?: SendOpts
): Promise<void> => {
  const ledger = await getLedgerActor(secretKey);
  ledger
    .send_dfx({
      to,
      fee: { e8s: opts?.fee || defaultArgs.fee },
      amount: { e8s: amount },
      memo: opts?.memo || defaultArgs.memo,
      from_subaccount: [], // For now, using default subaccount to handle ICP
      created_at_time: [],
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log('ERROR: ', err));
};
