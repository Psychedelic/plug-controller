import { DERIVATION_PATH } from "../constants";

const { derivePath }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const pbkdf2  = require('pbkdf2');
const nacl  = require('tweetnacl');

export const seedFromMnemonic = (mnemonic: String) => pbkdf2.pbkdf2Sync(mnemonic.replace(' ', ''), 'Salt', 2048, 64, 'sha512')

export const createAccountCredentials = () : { mnemonic: string, secretKey: Uint8Array, publicKey: Uint8Array } => {
    const mnemonic = bip39.generateMnemonic();
    const { secretKey, publicKey } = createKeysFromMnemonic(mnemonic);
    return { mnemonic, secretKey, publicKey }
}

export const createKeysFromMnemonic = (mnemonic: string) => {
    const hexSeed = seedFromMnemonic(mnemonic);
    // We shouldn't use the master key, so we derive a child key
    const { key: childKey } = derivePath(DERIVATION_PATH, hexSeed);
    // Create Pub-Priv key-pair
    return nacl.sign.keyPair.fromSeed(childKey);
} 
