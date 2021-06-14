class StorageMock {
    private store: any;
    public local: {
        get: () => any;
        set: (obj: any) => void;
    }

    public constructor() {
      this.store = {};
      this.local = {
        set: this.set.bind(this),
        get: this.get.bind(this),
      };
    }
  
    public set = (obj = {}) => {
      this.store = {
        ...this.store,
        ...obj,
      };
    }
  
    public get = () => {
      return { ...this.store };
    }

    public clear = () => {
      this.set({});
      return {};
    }
  }
  

  const store = new StorageMock();

  export default store;