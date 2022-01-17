import { PlugState } from './plug_keyring'

export interface StorageData {
    vault: PlugState;
    isInitialized: boolean;
    isUnlocked: boolean;
    currentWalletId: number;
}

export interface KeyringStorage {
    isSupported: boolean;
    get: () => Promise<unknown>;
    set: (state: unknown) => Promise<void>;
    clear: () => Promise<void>;
}