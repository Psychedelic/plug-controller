import { NetworkModuleParams } from '../PlugKeyRing/modules/NetworkModule';
import { PlugStateStorage } from './plug_keyring';

export interface StorageData {
  vault: PlugStateStorage;
  isInitialized: boolean;
  isUnlocked: boolean;
  currentWalletId: string;
  version: string;
  networkModule: NetworkModuleParams;
}
