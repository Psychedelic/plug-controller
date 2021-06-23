import { HttpAgent, Actor, ActorSubclass, ActorMethod } from '@dfinity/agent';

import * as ledgerMethods from './methods';
import { LEDGER_CANISTER_ID } from '../constants';
import ledgerIDLFactory from '../../../idls/ledger.did';
import LedgerService from '../../../interfaces/ledger';

type LedgerActorConstructor = new () => ActorSubclass;

const createLedgerActorClass = (agent: HttpAgent): LedgerActorConstructor => {
  class LedgerActor extends Actor.createActorClass(ledgerIDLFactory) {
    constructor() {
      super({ agent, canisterId: LEDGER_CANISTER_ID });

      Object.keys(ledgerMethods).forEach(methodName => {
        this[methodName] = ((...args: unknown[]) =>
          ledgerMethods[methodName](this, ...args) as unknown) as ActorMethod;
      });
    }
  }

  return LedgerActor;
};

export const createLedgerActor = (
  agent: HttpAgent
): ActorSubclass<LedgerService> => {
  return (new (createLedgerActorClass(agent))() as unknown) as ActorSubclass<
    LedgerService
  >;
};

export default createLedgerActor;
