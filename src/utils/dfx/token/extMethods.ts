import { ActorSubclass, Actor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { ERRORS } from '../../../errors';

import ExtService, { Metadata } from '../../../interfaces/ext';
import {
  Balance,
  BurnParams,
  getDecimals,
  InternalTokenMethods,
  SendParams,
  SendResponse,
  parseAmountToSend,
} from './methods';

const getMetadata = async (
  actor: ActorSubclass<ExtService>
): Promise<Metadata> => {
  const token = Actor.canisterIdOf(actor).toText();

  const extensions = await actor.extensions();
  if (!extensions.includes('@ext/common'))
    throw new Error(ERRORS.TOKEN_NOT_SUPPORT_METADATA);
  const metadataResult = await actor.metadata(token);

  if ('ok' in metadataResult) return metadataResult.ok;

  throw new Error(Object.keys(metadataResult.error)[0]);
};

const send = async (
  actor: ActorSubclass<ExtService>,
  { to, from, amount }: SendParams
): Promise<SendResponse> => {
  const dummyMemmo = new Array(32).fill(0);
  const token = Actor.canisterIdOf(actor).toText();

  const decimals = getDecimals(await getMetadata(actor));
  const parsedAmount = parseAmountToSend(amount, decimals);

  const data = {
    to: { principal: Principal.fromText(to) },
    from: { principal: Principal.from(from) },
    amount: parsedAmount,
    token,
    memo: dummyMemmo,
    notify: false,
    subaccount: [],
    fee: BigInt(1),
  };

  const transferResult = await actor.transfer(data);

  if ('ok' in transferResult) return { amount: transferResult.ok.toString() };

  throw new Error(Object.keys(transferResult.error)[0]);
};

const getBalance = async (
  actor: ActorSubclass<ExtService>,
  user: Principal
): Promise<Balance> => {
  const token = Actor.canisterIdOf(actor).toText();

  const balanceResult = await actor.balance({
    token,
    user: { principal: user },
  });

  const decimals = getDecimals(await getMetadata(actor));

  if ('ok' in balanceResult)
    return { value: balanceResult.ok.toString(), decimals };

  throw new Error(Object.keys(balanceResult.error)[0]);
};

const burnXTC = async (
  _actor: ActorSubclass<ExtService>,
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
