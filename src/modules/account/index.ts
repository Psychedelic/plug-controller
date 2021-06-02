import { Principal } from "@dfinity/agent";
const { derivePath }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const nacl  = require('tweetnacl');
const CryptoJS = require('crypto-js');

import { ERRORS } from "../../errors";
import { AccountCredentials } from "../../interfaces/account";
import { DERIVATION_PATH, ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO  } from "./constants";

const deriveSeed = (mnemonic: string, index?: number) => {
    const hexSeed = bip39.mnemonicToSeedSync(mnemonic);
    return derivePath(DERIVATION_PATH, hexSeed, index);
}

// TODO: Missing tests
export const createAccountId = (principalId: Principal, subAccount: string) => {
    const sha = CryptoJS.algo.SHA224.create();
    sha.update(Buffer.from(ACCOUNT_DOMAIN_SEPERATOR));
    sha.update(Buffer.from(principalId));
    sha.update(subAccount ? Buffer.from(subAccount) : SUB_ACCOUNT_ZERO);
    const hash = sha.finalize();
    return hash;
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