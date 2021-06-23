/* eslint-disable @typescript-eslint/no-explicit-any */
class StorageMock {
  private store: any;

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

  public clear = (): {} => {
    this.set({});
    return {};
  };
}

const store = new StorageMock();

export default store;
