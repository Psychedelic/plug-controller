import uuid from "uuid/v4";

type Network = {
  name: string;
  host: string;
  ledgerCanisterId: string;
  id?: string;
}

class NetworkModule {
  public network: Network | null;
  public registeredNetworks: Array<Network>;

  constructor() {
    this.registeredNetworks = [];
    this.network = null;
  }

  public addNetwork(network: Network) {
    this.registeredNetworks.push({ ...network, id: uuid() });
  }

  public removeNetwork(networkId: string) {
    this.registeredNetworks = this.registeredNetworks.filter(network => network.id !== networkId);
  }

  public setNetwork(network: Network) {
    this.network = network;
  }

  public resetNetwork() {
    this.network = null;
  }
}

export default NetworkModule;
