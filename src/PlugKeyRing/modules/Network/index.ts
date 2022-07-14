import { uuid } from "uuidv4";
import { KeyringStorage } from "../../../interfaces/storage";

export type Network = {
  name: string;
  host: string;
  ledgerCanisterId: string;
  id?: string;
};

export interface NetworkModuleParams {
  networks?: Network[];
  network?: Network | null;
  storage: KeyringStorage;
};

class NetworkModule {
  public network: Network | null;
  public networks: Array<Network>;
  private storage: KeyringStorage;

  constructor({ networks, network, storage }: NetworkModuleParams) {
    this.networks = networks || [];
    this.network = network || null;
    this.storage = storage;
  }

  private updateStorage() {
    console.log('updating storage', this.storage, this.toJSON());
    this.storage.set({ networkModule: this.toJSON() });
  }

  public addNetwork(network: Network) {
    this.networks.push({ ...network, id: uuid() });
    console.log('added network', network, this.networks);
    console.log('updating storage');
    this.updateStorage();
    return this.networks;
  }

  public removeNetwork(networkId: string) {
    this.networks = this.networks.filter(network => network.id !== networkId);
    return this.networks;
  }

  public setNetwork(networkId: string) {
    const network = this.networks.find((n) => n.id === networkId) || null;
    this.network = network;
    this.updateStorage();
    return network;
  }

  public resetNetwork() {
    this.network = null;
    this.updateStorage();
  }

  public toJSON() {
    return { network: this.network, networks: this.networks };
  }
}

export default NetworkModule;
