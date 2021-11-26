import { HttpAgent, Actor, ActorMethod, ActorSubclass } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';

type ExtendedActorConstructor = new () => ActorSubclass;

export type BaseMethodsExtendedActor<T> = {
  [K in keyof T as `_${Uncapitalize<string & K>}`]: T[K];
}

export const createExtendedActorClass = (
  agent: HttpAgent,
  methods,
  canisterId: string | Principal,
  IDLFactory: IDL.InterfaceFactory
): ExtendedActorConstructor => {
  class ExtendedActor extends Actor.createActorClass(IDLFactory) {
    constructor() {
      super({ agent, canisterId });

      Object.keys(this).forEach(methodName => {
        this[`_${methodName}`] = this[methodName];
      })

      Object.keys(methods).forEach(methodName => {
        this[methodName] = ((...args: unknown[]) =>
          methods[methodName](this, ...args) as unknown) as ActorMethod;
      });
    }
  }

  return ExtendedActor;
};

export default { createExtendedActorClass };
