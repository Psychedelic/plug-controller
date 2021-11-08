/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import Dip20Service from '../../../interfaces/dip20';
import { Metadata } from '../../../interfaces/ext';
import { BurnParams, InternalTokenMethods, SendParams } from './methods';
import { SendResponse } from '.';

const send = async (
  actor: ActorSubclass<Dip20Service>,
  {
    to,
    amount
  }: SendParams): Promise<SendResponse> => {
  const transferResult = await actor.transfer(Principal.fromText(to), amount);

  if ('ok' in transferResult) return { transactionId: transferResult.ok };

  throw new Error(Object.keys(transferResult.err)[0]);
};

const getBalance = (
  actor: ActorSubclass<Dip20Service>,
  user: Principal
): Promise<bigint> => {
  return actor.balanceOf(user);
};

const getMetadata = async (
  actor: ActorSubclass<Dip20Service>
): Promise<Metadata> => {
  const metadataResult = await actor.getMetadata();
  return {
    fungible: {
      symbol: metadataResult.symbol,
      decimals: metadataResult.decimals,
      name: metadataResult.name,
    },
  };
};

const burnXTC = async (_actor: ActorSubclass<Dip20Service>, _params: BurnParams) => {
  throw new Error('BURN NOT SUPPORTED');
}

export default { send, getMetadata, getBalance, burnXTC } as InternalTokenMethods;
