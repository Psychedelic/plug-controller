import { uuid } from "uuidv4";
import { Assets } from "../../../interfaces/plug_wallet";
import { KeyringStorage } from "../../../interfaces/storage";
import { DEFAULT_ASSETS, TOKENS } from "../../../constants/tokens";
import { IC_URL_HOST, PLUG_PROXY_HOST } from "../../../utils/dfx/constants";
import { TokenBalance } from "../../../interfaces/token";
import { validateCanisterId } from "../../utils";
import { ERRORS } from "../../../errors";
import { getTokenActor } from "@psychedelic/dab-js";

export interface NetworkModuleParams {
  networks?: Network[];
  network?: NetworkParams;
  storage: KeyringStorage;
  onNetworkChange: (network: Network) => void;
};

export type NetworkParams = {
  name: string;
  host: string;
  ledgerCanisterId?: string;
  assets?: Assets;
}

type EditNetworkParams = {
  name?: string;
  host?: string;
  ledgerCanisterId?: string;
}

export class Network {
  public name: string;
  public host: string;
  public ledgerCanisterId?: string;
  public assets: Assets;
  public id: string;
  public shouldProxy: boolean;

  constructor(networkParams: NetworkParams) {
    this.name = networkParams.name;
    this.host = networkParams.host;
    this.ledgerCanisterId = networkParams.ledgerCanisterId;
    this.id = uuid();
    this.shouldProxy = false;

    if (this.ledgerCanisterId) {
      this.assets = {
        [this.ledgerCanisterId]: { amount: '0', token: TOKENS.ICP },
      };
    }
  }

  public edit({ name, host, ledgerCanisterId }: EditNetworkParams) {
    this.name = name || this.name;
    this.host = host || this.host;
    this.ledgerCanisterId = ledgerCanisterId || this.ledgerCanisterId;
  }

  
  public addAsset = async (args: {
    canisterId: string,
    asset: TokenBalance,
  }): Promise<TokenBalance[]> => {
    const newTokens = {
      ...this.assets,
      [args.canisterId]: args.asset,
    };
    // const unique = uniqueByObjKey(newTokens, 'symbol') as StandardToken[];
    this.assets = newTokens;
    return Object.values(newTokens);
  };

  public removeToken = async ({ canisterId }: { canisterId: string }): Promise<TokenBalance[]> => {
    if (!Object.keys(this.assets).includes(canisterId)) {
      return Object.values(this.assets);
    }
    const { [canisterId]: removedToken, ...newTokens } = this.assets;
    this.assets = newTokens;
    return Object.values(newTokens);
  };

  public toJSON(): NetworkParams {
    return {
      name: this.name,
      host: this.host,
      ledgerCanisterId: this.ledgerCanisterId,
      assets: this.assets,
    };
  }
}

export class Mainnet extends Network {
  constructor() {
    super({
      name: 'Mainnet',
      host: PLUG_PROXY_HOST,
      ledgerCanisterId: TOKENS.ICP.canisterId,
    });
    this.id = 'mainnet';
    this.shouldProxy = true;
    this.assets = DEFAULT_ASSETS;
  }

  public edit(): void {
    return;
  }
}

const mainnet = new Mainnet();

class NetworkModule {
  public network: Network;
  public networks: Array<Network>;
  private storage: KeyringStorage;
  private onNetworkChange?: (network: Network) => void;

  constructor({ networks, network, storage, onNetworkChange }: NetworkModuleParams) {
    this.networks = networks || [mainnet];
    this.network = network ? new Network(network) : mainnet;
    this.storage = storage;
    this.onNetworkChange = onNetworkChange;
  }

  private update() {
    this.updateStorage();
    this.onNetworkChange?.(this.network);
  }

  private updateStorage() {
    console.log('updating storage', this.storage, this.toJSON());
    this.storage.set({ networkModule: this.toJSON() });
  }

  public addNetwork(network: NetworkParams) {
    this.networks.push(new Network(network));
    this.update();
    return this.networks;
  }

  public removeNetwork(networkId: string) {
    if (networkId === mainnet.id) throw new Error('Cannot remove mainnet');

    this.networks = this.networks.filter(network => network.id !== networkId);
    if (networkId === this.network.id) {
      this.network = mainnet;
    }
    return this.networks;
  }

  public setNetwork(networkId: string) {
    const network = this.networks.find((n) => n.id === networkId) || mainnet;
    this.network = network;
    this.update();
    return network;
  }

  public editNetwork(networkId: string, params: EditNetworkParams) {
    const network = this.networks.find((n) => n.id === networkId);
    network?.edit?.(params);
    if (networkId === this.network.id) {
      this.network = network || mainnet;
    }
    this.update();
    return network;
  }

  public resetNetwork() {
    this.network = mainnet;
    this.update();
    return this.network;
  }

  public toJSON() {
    return { network: this.network.toJSON(), networks: this.networks };
  }
}

export default NetworkModule;
