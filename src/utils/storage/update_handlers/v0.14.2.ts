import { TOKENS } from "../../../constants/tokens";
import { StorageData } from "../../../interfaces/storage"

export default (storage: any) : StorageData => ({
    ...storage,
    valut: {
        ...storage.vault,
        wallets: storage.value.wallets.map((wallet) => ({
            ...wallet,
            assets: wallet.assets.reduce((acum, asset) => ({...acum, [asset.canisterId]: {
                amount: '0',
                token: {
                    name: asset.name,
                    symbol: asset.symbol,
                    canisterId: asset.canisterId,
                    standard:  wallet.registeredTokens[asset.canisterId]?.standard || TOKENS[asset.symbol].standard,
                    decimals: wallet.registeredTokens[asset.canisterId]?.decimals || TOKENS[asset.symbol].decimals,
                    color: wallet.registeredTokens[asset.canisterId]?.color
                }
            }}), {})
        }))
    }
});