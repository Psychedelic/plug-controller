export type Key = {
    hex: string;
    binary: Uint8Array
}

export interface KeyPair {
    secretKey: Key;
    publicKey: Key;
}

export interface AccountCredentials extends KeyPair {
    mnemonic: string;
}