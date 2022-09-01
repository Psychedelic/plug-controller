// ED25519 key derivation path
export const DERIVATION_PATH = "m/44'/223'/0'/0";

// Dfinity Account separator
export const ACCOUNT_DOMAIN_SEPERATOR = '\x0Aaccount-id';

// Subaccounts are arbitrary 32-byte values.
export const SUB_ACCOUNT_ZERO = Buffer.alloc(32);

export const HARDENED_OFFSET = 0x80000000;

export enum Types {
    fromMnemonic = "FROM_MNEMONIC",
    fromPem256k1 = "FROM_PEM_256k1",
    fromPem25519 = "FROM_PEM_25519",
}