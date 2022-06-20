import { PLUG_PROXY_HOST } from "../../../utils/dfx/constants";

const DEFAULT_NETWORK = {
  name: "Mainnet",
  host: PLUG_PROXY_HOST,
  ledgerCanisterId: "",
}

type Network = typeof DEFAULT_NETWORK;

class NetworkModule {
  public network: Network;
  public usingMainnet: boolean;
  public registeredNetworks: Array<Network>;

  public setNetwork(network: Network) {
    this.network = network;
    this.usingMainnet = false;
  }

  public resetNetwork() {
    this.network = DEFAULT_NETWORK;
    this.usingMainnet = true;
  }
}

export default NetworkModule;
