/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import Dip20Service from '../../../interfaces/dip20';
import { Metadata } from '../../../interfaces/ext';
import {
  Balance,
  BurnParams,
  getDecimals,
  InternalTokenMethods,
  parseAmountToSend,
  SendParams,
  SendResponse,
} from './methods';

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

const send = async (
  actor: ActorSubclass<Dip20Service>,
  { to, amount }: SendParams
): Promise<SendResponse> => {
  const decimals = getDecimals(await getMetadata(actor));

  const parsedAmount = parseAmountToSend(amount, decimals);

  const transferResult = await actor.transfer(
    Principal.fromText(to),
    parsedAmount
  );

  if ('ok' in transferResult)
    return { transactionId: transferResult.ok.toString() };

  throw new Error(Object.keys(transferResult.err)[0]);
};

const getBalance = async (
  actor: ActorSubclass<Dip20Service>,
  user: Principal
): Promise<Balance> => {
  const decimals = getDecimals(await getMetadata(actor));
  const value = (await actor.balanceOf(user)).toString();
  return { value, decimals };
};

const burnXTC = async (
  _actor: ActorSubclass<Dip20Service>,
  _params: BurnParams
) => {
  throw new Error('BURN NOT SUPPORTED');
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
} as InternalTokenMethods;
