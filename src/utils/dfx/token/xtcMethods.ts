import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import XtcService from '../../../interfaces/xtc';
import { Metadata } from '../../../interfaces/ext';

const send = async (
  actor: ActorSubclass<XtcService>,
  to: Principal,
  from: Principal,
  amount: bigint
): Promise<bigint> => {
  const transferResult = await actor.transfer({ to, from: [from], amount });

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

export default { send, balance, metadata };
