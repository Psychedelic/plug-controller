import { ERRORS } from "../../../errors";
import { KeyringStorage } from "../../../interfaces/storage";
import { EditNetworkParams, Mainnet, Network, NetworkParams } from "./Network";

export interface NetworkModuleParams {
  networks?: Network[];
  network?: NetworkParams;
  storage: KeyringStorage;
  onNetworkChange: (network: Network) => void;
};

const createNetwork = (network?: NetworkParams) =>
  (!network || network.id === 'mainnet')
    ? new Mainnet(network)
    : new Network(network);

class NetworkModule {
  public network: Network;
  public networks: Array<Network>;
  private storage: KeyringStorage;
  private onNetworkChange?: (network: Network) => void;



  constructor({ networks, network, storage, onNetworkChange }: NetworkModuleParams) {
    this.networks = networks?.map(createNetwork) || [new Mainnet()];
    this.network = createNetwork(network);
    this.storage = storage;
    this.onNetworkChange = onNetworkChange;
  }

  private update() {
    this.updateStorage();
    this.onNetworkChange?.(this.network);
  }

  private updateStorage() {
    this.storage.set({ networkModule: this.toJSON() });
  }

  public addNetwork(network: NetworkParams) {
    this.networks.push(new Network(network));
    this.update();
    return this.networks;
  }

  public removeNetwork(networkId: string) {
    if (networkId === 'mainnet') throw new Error('Cannot remove mainnet');
    this.networks = this.networks.filter(network => network.id !== networkId);
    
    // If we remove the current network, default to mainnet.
    if (networkId === this.network.id) {
      this.network = this.networks.find(network => network.id === 'mainnet') || new Mainnet();
    }
    return this.networks;
  }

  public setNetwork(networkId: string) {
    const network = this.networks.find((n) => n.id === networkId);
    if (!network) throw new Error(ERRORS.INVALID_NETWORK_ID);
    this.network = network;
    this.update();
    return network;
  }

  public editNetwork(networkId: string, params: EditNetworkParams) {
    const network = this.networks.find((n) => n.id === networkId);
    if (!network) throw new Error(ERRORS.INVALID_NETWORK_ID);
    network?.edit?.(params);
    if (networkId === this.network.id) {
      this.network = network;
    }
    this.update();
    return network;
  }

  public toJSON() {
    return { network: this.network.toJSON(), networks: this.networks };
  }
}

export { Network };

export default NetworkModule;
