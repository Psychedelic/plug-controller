/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import RandomBigInt from 'random-bigint';
import { ActorSubclass } from '@dfinity/agent';

import LedgerService, { ICPTs, TimeStamp } from '../../../interfaces/ledger';

interface SendOpts {
  fee?: bigint;
  memo?: bigint;
  from_subaccount?: number;
  created_at_time?: TimeStamp; // TODO: create js Date to TimeStamp function
}

interface SendICPArgs {
  to: string;
  amount: bigint;
  opts?: SendOpts;
}

export interface LedgerServiceExtended extends LedgerService {
  sendICP: (args_0: SendICPArgs) => Promise<void>;
  getBalance: (accountId: string) => Promise<bigint>;
}

const sendICP = async (
  actor: ActorSubclass<LedgerService>,
  args: SendICPArgs
): Promise<void> => {
  const { to, amount, opts } = args;
  const defaultArgs = {
    fee: BigInt(10000),
    memo: RandomBigInt(32),
  };
  actor
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

const getBalance = async (
  actor: ActorSubclass<LedgerService>,
  accountId: string
): Promise<bigint> => {
  const balance = await actor.account_balance_dfx({ account: accountId });
  return balance.e8s;
};

export default { sendICP, getBalance };
