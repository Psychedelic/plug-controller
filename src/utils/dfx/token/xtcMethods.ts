/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import XtcService from '../../../interfaces/xtc';
import { Metadata } from '../../../interfaces/ext';
import { InternalTokenMethods, SendParams } from './methods';
import { SendResponse } from '.';

const send = async (
  actor: ActorSubclass<XtcService>,
  {
    to,
    amount
  }: SendParams): Promise<SendResponse> => {
  const transferResult = await actor.transferErc20(Principal.fromText(to), amount);

  if ('Ok' in transferResult) return { transactionId: transferResult.Ok };

  throw new Error(Object.keys(transferResult.Err)[0]);
};

const getBalance = (
  actor: ActorSubclass<XtcService>,
  user: Principal
): Promise<bigint> => {
  return actor.balance([user]);
};

const getMetadata = async (
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

const burnXTC = async (actor: ActorSubclass<XtcService>, { to, amount }) =>
  actor.burn({ canister_id: to, amount });

export default { send, getMetadata, getBalance, burnXTC } as InternalTokenMethods;
