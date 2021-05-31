import { DERIVATION_PATH } from "../constants";

const { derivePath }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const nacl  = require('tweetnacl');

export const createAccount = () : { mnemonic: string, secretKey: Uint8Array, publicKey: Uint8Array } => {
    const mnemonic = bip39.generateMnemonic();
    return getKeys(mnemonic);
}

export const createAccountFromMnemonic = (mnemonic: string, accountNumber: number) => getKeys(mnemonic, accountNumber);

const deriveSeed = (mnemonic: string, index?: number) => {
    const hexSeed = bip39.mnemonicToSeedSync(mnemonic);
    return derivePath(DERIVATION_PATH, hexSeed, index);
}

const getKeys = (mnemonic: string, index?: number) => {
    const { key } = deriveSeed(mnemonic, index);
    const { secretKey, publicKey } = nacl.sign.keyPair.fromSeed(key);
    return { mnemonic, secretKey, publicKey }
}