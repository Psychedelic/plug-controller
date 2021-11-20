/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import RandomBigInt from 'random-bigint';
import { ActorSubclass } from '@dfinity/agent';

import LedgerService, { TimeStamp } from '../../../interfaces/ledger';
import { Balance } from '../token/methods';

const DECIMALS = 8;

export interface SendOpts {
  fee?: bigint;
  memo?: string;
  from_subaccount?: number;
  created_at_time?: TimeStamp; // TODO: create js Date to TimeStamp function
}

interface SendICPArgs {
  to: string;
  amount: string;
  opts?: SendOpts;
}

export interface LedgerServiceExtended extends LedgerService {
  sendICP: (args_0: SendICPArgs) => Promise<string>;
  getBalance: (accountId: string) => Promise<Balance>;
}

const sendICP = async (
  actor: ActorSubclass<LedgerService>,
  args: SendICPArgs
): Promise<bigint> => {
  const { to, amount, opts } = args;
  const defaultArgs = {
    fee: BigInt(10000),
    memo: RandomBigInt(32),
  };
  const parsedAmount = BigInt(parseFloat(amount) * 10 ** DECIMALS);
  return actor.send_dfx({
    to,
    fee: { e8s: opts?.fee || defaultArgs.fee },
    amount: { e8s: parsedAmount },
    memo: opts?.memo ? BigInt(opts.memo) : defaultArgs.memo,
    from_subaccount: [], // For now, using default subaccount to handle ICP
    created_at_time: [],
  });
};

const getBalance = async (
  actor: ActorSubclass<LedgerService>,
  accountId: string
): Promise<Balance> => {
  const balance = await actor.account_balance_dfx({ account: accountId });
  return { value: balance.e8s.toString(), decimals: DECIMALS };
};

export default { sendICP, getBalance };
