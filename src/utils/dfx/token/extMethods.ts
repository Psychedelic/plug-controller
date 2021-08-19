import { ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { ERRORS } from '../../../errors';

import ExtService, { Balance, Metadata } from '../../../interfaces/ext';

const send = async (
  actor: ActorSubclass<ExtService>,
  to: string,
  from: string,
  amount: bigint,
  token: string
): Promise<bigint> => {
  const dummyMemmo = new Array(32).fill(0);

  const data = {
    to: { principal: Principal.fromText(to) },
    from: { principal: Principal.from(from) },
    amount,
    token,
    memo: dummyMemmo,
    notify: false,
    subaccount: [],
    fee: BigInt(1),
  };

  const transferResult = await actor.transfer(data);

  if ('ok' in transferResult) return transferResult.ok;

  throw new Error(Object.keys(transferResult.error)[0]);
};

const metadata = async (
  actor: ActorSubclass<ExtService>,
  token: string
): Promise<Metadata> => {
  const extensions = await actor.extensions();
  if (!extensions.includes('@ext/common'))
    throw new Error(ERRORS.TOKEN_NOT_SUPPORT_METADATA);
  const metadataResult = await actor.metadata(token);

  if ('ok' in metadataResult) return metadataResult.ok;

  throw new Error(Object.keys(metadataResult.error)[0]);
};

const balance = async (
  actor: ActorSubclass<ExtService>,
  token: string,
  user: Principal
): Promise<Balance> => {
  const balanceResult = await actor.balance({
    token,
    user: { principal: user },
  });

  if ('ok' in balanceResult) return balanceResult.ok;

  throw new Error(Object.keys(balanceResult.error)[0]);
};

export default { send, metadata, balance };
