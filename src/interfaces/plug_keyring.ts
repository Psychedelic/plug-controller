import type PlugWallet from '../PlugWallet'
import {
    JSONWallet
  } from '../interfaces/plug_wallet';

export interface PlugState {
  password?: string;
  currentWalletId?: string;
  mnemonicWalletCount: number;
  walletIds?: Array<string>
}
export interface PlugStateStorage extends PlugState {
  wallets: { [key : string]: JSONWallet };
}

export interface PlugStateInstance extends PlugState {
  wallets: { [key : string]: PlugWallet };
}
