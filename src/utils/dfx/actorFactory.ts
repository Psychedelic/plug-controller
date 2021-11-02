import { HttpAgent, Actor, ActorMethod, ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';

type ExtendedActorConstructor = new () => ActorSubclass;

export const createExtendedActorClass = (
  agent: HttpAgent,
  methods,
  canisterId: string | Principal,
  IDLFactory: IDL.InterfaceFactory
): ExtendedActorConstructor => {
  class ExtendedActor extends Actor.createActorClass(IDLFactory) {
    constructor() {
      super({ agent, canisterId });

      Object.keys(methods).forEach(methodName => {
        this[methodName] = ((...args: unknown[]) =>
          methods[methodName](this, ...args) as unknown) as ActorMethod;
      });
    }
  }

  return ExtendedActor;
};

export default { createExtendedActorClass };
