import type PlugWallet from '../PlugWallet'
import {
    JSONWallet
  } from '../interfaces/plug_wallet';

export interface PlugState {
    wallets: Array<JSONWallet>;
    password?: string;
    currentWalletId?: number;
}

export interface PlugStateInstance {
  wallets: Array<PlugWallet>;
  password?: string;
  currentWalletId?: number;
}