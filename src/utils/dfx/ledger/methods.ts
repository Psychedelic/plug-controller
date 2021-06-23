/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import RandomBigInt from 'random-bigint';

import { ICPTs, TimeStamp } from '../../../interfaces/ledger';

interface SendOpts {
  fee?: bigint;
  memo?: bigint;
  from_subaccount?: number;
  created_at_time?: TimeStamp; // TODO: create js Date to TimeStamp function
}

// @params: to, amount, opts
export const sendICP = async (
  actor,
  to: string,
  amount: bigint,
  opts: SendOpts
): Promise<void> => {
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

export const getBalances = async (
  actor,
  accountIds: string[]
): Promise<ICPTs[]> => {
  const balances = Promise.all(
    accountIds.map(accountId => actor.account_balance_dfx(accountId))
  );
  return balances;
};

export default {};
