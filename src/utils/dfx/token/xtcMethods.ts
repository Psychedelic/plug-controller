/* eslint-disable @typescript-eslint/camelcase */
import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';

import XtcService, { BurnResult } from '../../../interfaces/xtc';
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

const send = async (
  actor: ActorSubclass<XtcService>,
  { to, amount }: SendParams
): Promise<SendResponse> => {
  const decimals = getDecimals(await getMetadata(actor));
  const parsedAmount = parseAmountToSend(amount, decimals);

  const transferResult = await actor.transferErc20(
    Principal.fromText(to),
    parsedAmount
  );

  if ('Ok' in transferResult)
    return { transactionId: transferResult.Ok.toString() };

  throw new Error(Object.keys(transferResult.Err)[0]);
};

const getBalance = async (
  actor: ActorSubclass<XtcService>,
  user: Principal
): Promise<Balance> => {
  const decimals = getDecimals(await getMetadata(actor));
  const value = (await actor.balance([user])).toString();
  return { value, decimals };
};

const burnXTC = async (
  actor: ActorSubclass<XtcService>,
  { to, amount }: BurnParams
): Promise<BurnResult> => {
  const decimals = getDecimals(await getMetadata(actor));
  const parsedAmount = parseAmountToSend(amount, decimals);
  return actor.burn({ canister_id: to, amount: parsedAmount });
};

export default {
  send,
  getMetadata,
  getBalance,
  burnXTC,
} as InternalTokenMethods;
