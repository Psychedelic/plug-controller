import type PlugWallet from '../PlugWallet'
import {
    JSONWallet
  } from '../interfaces/plug_wallet';

export interface PlugState {
  password?: string;
  currentWalletId?: number;
}
export interface PlugStateStorage extends PlugState {
  wallets: Array<JSONWallet>;
}

export interface PlugStateInstance extends PlugState {
  wallets: Array<PlugWallet>;
}
