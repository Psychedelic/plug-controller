import { DERIVATION_PATH, ERRORS } from "../../constants";
import { AccountCredentials } from "../../interfaces/account";

const { derivePath }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const nacl  = require('tweetnacl');

const deriveSeed = (mnemonic: string, index?: number) => {
    const hexSeed = bip39.mnemonicToSeedSync(mnemonic);
    return derivePath(DERIVATION_PATH, hexSeed, index);
}

const getAccountCredentials = (mnemonic: string, accountId?: number): AccountCredentials => {
    const { key } = deriveSeed(mnemonic, accountId);
    const { secretKey, publicKey } = nacl.sign.keyPair.fromSeed(key);
    return { 
        mnemonic,
        secretKey: { hex: secretKey.toString('hex'), binary: secretKey },
        publicKey: { hex: publicKey.toString('hex'), binary: publicKey }
    }
}

export const createAccount = () : AccountCredentials => {
    const mnemonic = bip39.generateMnemonic();
    return getAccountCredentials(mnemonic);
}

export const createAccountFromMnemonic = (mnemonic: string, accountId: number) : AccountCredentials => {
    if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
        throw new Error(ERRORS.INVALID_MNEMONIC);
    }
    if (!accountId || typeof accountId !== 'number' || accountId < 0) {
        throw new Error(ERRORS.INVALID_ACC_ID);
    }
    return getAccountCredentials(mnemonic, accountId);
}