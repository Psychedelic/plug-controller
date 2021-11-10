import { HttpAgent, ActorSubclass } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { IDL } from '@dfinity/candid';

import { createExtendedActorClass } from '../actorFactory';
import defaultMethods, { InternalTokenMethods, TokenServiceExtended } from './methods';
import xtcMethods from './xtcMethods';
import extMethods from './extMethods';
import dip20Methods from './dip20Methods';
import extIDL from '../../../idls/ext.did';
import xtcIDL from '../../../idls/xtc.did';
import dip20IDL from '../../../idls/dip20.did'
import { XTC_ID } from '../constants';


const getMethods = (standard: string): InternalTokenMethods => ({
  xtc: xtcMethods,
  ext: extMethods,
  dip20: dip20Methods
})[standard] || defaultMethods

const getIdl = (standard: string): IDL.InterfaceFactory => {
  const idl = {
    xtc: xtcIDL,
    ext: extIDL,
    dip20: dip20IDL,
  }[standard]
  if (!idl) throw new Error('Standard Not Implemented');
  return idl;
}

export const createTokenActor = async (
  canisterId: string | Principal,
  agent: HttpAgent,
  standard: string,
): Promise<ActorSubclass<TokenServiceExtended>> => {
  const idl = getIdl(standard);

  const actor = (new (createExtendedActorClass(
    agent,
    getMethods(standard),
    canisterId,
    idl
  ))() as unknown) as ActorSubclass<TokenServiceExtended>;
  return actor;
};

export default {};

export { SendResponse } from './methods';
