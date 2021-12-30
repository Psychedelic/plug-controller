import { HttpAgent, ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { IDL } from '@dfinity/candid';

import { createExtendedActorClass } from '../actorFactory';
import defaultMethods, {
  Balance,
  InternalTokenMethods,
  TokenServiceExtended,
} from './methods';
import xtcMethods from './xtcMethods';
import extMethods from './extMethods';
import dip20Methods from './dip20Methods';
import wicpMethods from './wicp';
import extIDL from '../../../idls/ext.did';
import xtcIDL from '../../../idls/xtc.did';
import dip20IDL from '../../../idls/dip20.did';
import wicpIDL from '../../../idls/wicp.did';
import { TOKENS } from '../../../constants/tokens';
import { StandardToken } from '../../../interfaces/ext';

const getMethods = (standard: string): InternalTokenMethods =>
  ({
    xtc: xtcMethods,
    ext: extMethods,
    dip20: dip20Methods,
    wicp: wicpMethods
  }[standard] || defaultMethods);

const getIdl = (standard: string): IDL.InterfaceFactory => {
  const idl = {
    xtc: xtcIDL,
    ext: extIDL,
    dip20: dip20IDL,
    wicp: wicpIDL
  }[standard];
  if (!idl) throw new Error(`Standard ${standard} Not Implemented`);
  return idl;
};

export const createTokenActor = async <T>(
  canisterId: string | Principal,
  agent: HttpAgent,
  standard: string
): Promise<ActorSubclass<TokenServiceExtended<T>>> => {
  const idl = getIdl(standard);

  const actor = (new (createExtendedActorClass(
    agent,
    getMethods(standard),
    canisterId,
    idl
  ))() as unknown) as ActorSubclass<TokenServiceExtended<any>>;
  return actor;
};

export const formatStorageTokens = (
  tokens: any[]
): { [tokenCanister: string]: StandardToken } =>
  Object.values(tokens).reduce(
    (acum, token) => ({
      ...acum,
      [token.canisterId]: {
        ...token,
        standard: TOKENS?.[token.symbol]?.standard || token?.standard || 'dip20',
      },
    }),
    {}
  );

export const parseBalance = (balance: Balance): string => {
  return (parseInt(balance.value, 10) / 10 ** balance.decimals).toString();
};

export default {};

export { SendResponse } from './methods';
