/* eslint-disable import/no-cycle */
import PlugWallet from '../PlugWallet';
import { JSONWallet } from './plug_wallet';

export interface PlugState {
  password?: string;
  currentWalletId?: string;
  mnemonicWalletCount: number;
  walletIds?: Array<string>;
}
export interface PlugStateStorage extends PlugState {
  wallets: { [key: string]: JSONWallet };
}

export interface PlugStateInstance extends PlugState {
  wallets: { [key: string]: PlugWallet };
}

export interface KeyringStorage {
  isSupported: boolean;
  get: (key?: string) => Promise<unknown>;
  set: (state: unknown) => Promise<void>;
  clear: () => Promise<void>;
}
