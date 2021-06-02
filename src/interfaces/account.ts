import { Ed25519KeyIdentity } from "@dfinity/identity";

export type Key = {
    hex: string;
    binary: Uint8Array
}

export interface KeyPair {
    secretKey: Key;
    publicKey: Key;
}

export interface AccountCredentials {
    mnemonic: string;
    identity: Ed25519KeyIdentity,
    accountId: string
}