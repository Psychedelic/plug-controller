import { ERRORS } from "../../../errors";
import { KeyringStorage } from "../../../interfaces/storage";
import { EditNetworkParams, Mainnet, Network, NetworkParams } from "./Network";

export interface NetworkModuleParams {
  fetch: any;
  networks?: { [networkId: string]: Network };
  networkId?: string;
  storage: KeyringStorage;
  onNetworkChange: (network: Network) => void;
};

const createNetwork = (fetch, network) => network.id === 'mainnet' ? new Mainnet(network, fetch) : new Network(network, fetch);
const createNetworks = (fetch, networks?: { [id: string]: Network }, onChange?: () => void) => {
  if (!!Object.values(networks || {})?.length) {
    return Object.values(networks!)?.reduce(
      (acum, net) => ({ ...acum, [net.id]: createNetwork(fetch, { ...net, onChange }) })
    , {});
  }
 return { mainnet: new Mainnet({ onChange }, fetch) };
};

class NetworkModule {
  public networkId: string;
  public networks: { [networkId: string]: Network };
  private fetch: any;
  private storage: KeyringStorage;
  private onNetworkChange?: (network: Network) => void;


  constructor({ networks, networkId, storage, onNetworkChange, fetch }: NetworkModuleParams) {
    this.fetch = fetch;
    this.storage = storage;
    this.onNetworkChange = onNetworkChange;
    this.networkId = networkId || 'mainnet';
    this.networks = createNetworks(this.fetch, networks, this.update.bind(this));
  }

  public get network(): Network {
    return this.networks[this.networkId];
  }

  public updateStorage() {
    this.storage.set({ networkModule: this.toJSON() });
  }
  
  private update() {
    this.updateStorage?.();
    this.onNetworkChange?.(this.network);
  }


  public addNetwork(networkParams: NetworkParams) {
    // Validate network host is a valid https url
    // if (!networkParams.host.startsWith('https://')) {
    //   throw new Error('Network must start with https://');
    // }
    if (Object.values(this.networks).some((net) => net.host === networkParams.host)) {
      throw new Error(`A Network with host ${networkParams.host} already exists`);
    }
    const network = createNetwork(this.fetch, { ...networkParams, onChange: this.update.bind(this) });
    this.networks = { ...this.networks, [network.id!]: network };
    this.update();
    return this.networks;
  }

  public removeNetwork(networkId: string) {
    if (networkId === 'mainnet') throw new Error('Cannot remove mainnet');
    if (!Object.keys(this.networks).includes(networkId)) throw new Error(ERRORS.INVALID_NETWORK_ID);
    // If we remove the current network, default to mainnet.
    if (networkId === this.network.id) {
      this.networkId = 'mainnet';
    }
    const { [networkId]: network, ...networks } = this.networks;
    this.networks = networks;
    this.update();
    return this.networks;
  }

  public setNetwork(networkId: string) {
    const network = this.networks[networkId];
    if (!network) throw new Error(ERRORS.INVALID_NETWORK_ID);
    this.networkId = networkId;
    this.update();
    return network;
  }

  public editNetwork(networkId: string, params: EditNetworkParams) {
    const network = this.networks[networkId];
    if (!network) throw new Error(ERRORS.INVALID_NETWORK_ID);
    network?.edit?.(params);
    this.networks = { ...this.networks, [networkId]: network };
    this.update();
    return network;
  }

  public toJSON() {
    return {
      networkId: this.networkId,
      networks: Object.values(this.networks).reduce(
        (acum, net) => ({ ...acum, [net.id]: net.toJSON() }), {},
      )
    };
  }
}

export { Network };

export default NetworkModule;
