/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
class StorageMock {
  private store: any;

  public isSupported: boolean;

  public local: {
    get: () => any;
    set: (obj: any) => void;
  };

  public constructor() {
    this.store = {};
    this.local = {
      set: this.set.bind(this),
      get: this.get.bind(this),
    };
    this.isSupported = true;
  }

  public set = (obj = {}): any => {
    this.store = {
      ...this.store,
      ...obj,
    };
  };

  public get = (): any => {
    return { ...this.store };
  };

  public clear = (): any => {
    this.set({});
    return {};
  };
}

const store = new StorageMock();

export default store;
