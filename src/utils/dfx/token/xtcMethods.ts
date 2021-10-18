/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import XtcService from '../../../interfaces/xtc';
import { Metadata } from '../../../interfaces/ext';

const send = async (
  actor: ActorSubclass<XtcService>,
  to: Principal,
  amount: bigint
): Promise<bigint> => {
  const transferResult = await actor.transferErc20(to, amount);

  if ('Ok' in transferResult) return transferResult.Ok;

  throw new Error(Object.keys(transferResult.Err)[0]);
};

const balance = (
  actor: ActorSubclass<XtcService>,
  user: Principal
): Promise<bigint> => {
  return actor.balance([user]);
};

const metadata = async (
  actor: ActorSubclass<XtcService>
): Promise<Metadata> => {
  const metadataResult = await actor.meta();
  return {
    fungible: {
      symbol: metadataResult.symbol,
      decimals: metadataResult.decimal,
      name: metadataResult.name,
    },
  };
};

const burn = async (actor: ActorSubclass<XtcService>, { to, amount }) =>
  actor.burn({ canister_id: to, amount });

export default { send, balance, metadata, burn };
