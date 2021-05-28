import { DERIVATION_PATH } from "../constants";

const { derivePath, getMasterKeyFromSeed }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const pbkdf2  = require('pbkdf2');
const nacl  = require('tweetnacl');

const seedFromMnemonic = (mnemonic: String) => pbkdf2.pbkdf2Sync(mnemonic.replace(' ', ''), 'Salt', 2048, 64, 'sha512')

export const createAccount = () : { mnemonic: string, secretKey: Uint8Array, publicKey: Uint8Array } => {
    const mnemonic = bip39.generateMnemonic();
    const hexSeed = seedFromMnemonic(mnemonic);
    // const { key: masterKey, chainCode } = getMasterKeyFromSeed(hexSeed);

    // We shouldn't use the master key, so we derive a child key
    const { key: childKey, chainCode: childChainCode } = derivePath(DERIVATION_PATH, hexSeed);

    // Create Pub-Priv key-pair
    const { secretKey, publicKey } = nacl.sign.keyPair.fromSeed(childKey);
    return { mnemonic, secretKey, publicKey }
}
