import { v4 as uuid } from "uuid";
import { Network } from '../../../PlugKeyRing/modules/NetworkModule/Network'

export default (storage: any) => {
    const walletIds = storage.wallets.map(()=> uuid())
    const networkModule = storage.networkModuleBis || storage.networkModule; 
    const networks: { [networkId: string]: Network } = networkModule.networks;

    const editedNetworks = ((networks && Object.values(networks)) || []).map((network) => ({
      ...network,
      registeredTokens: network.registeredTokens.map((token)=> {
        const registeredBy = token.registeredBy.map((walletNumber) => walletIds[walletNumber]);
        return ({
          ...token,
          registeredBy,
        })
      })
    }))

    const finalNetwork = editedNetworks.reduce((accum, network)=> ({
      ...accum,
      [network.id]: network,
    }), {})

    return {
        ...storage, 
        wallets: storage.wallets.reduce(
          (walletsAccum, wallet, index) => {
            const walletId = walletIds[index];
            return ({
              ...walletsAccum,
              [walletId]: { ...wallet, walletId, orderNumber: index }
            })
          }, {}),
        walletIds,
        mnemonicWalletCount: walletIds.length,
        networkModule: {
          ...storage.networkModule,
          networks: finalNetwork
        },
    }
};
