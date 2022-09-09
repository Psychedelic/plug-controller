import { v4 as uuid } from "uuid";

export default (storage: any) => {
    const walletIds = storage.wallets.map(()=> uuid())
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
        mnemonicWalletCount: walletIds.length
    }
};
