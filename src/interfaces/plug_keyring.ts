import type PlugWallet from '../PlugWallet'

export interface PlugState {
    wallets: Array<PlugWallet>;
    password?: string;
    currentWalletId?: number;
}