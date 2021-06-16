const bip39  = require('bip39');
const CryptoJS = require('crypto-js');
const { Ed25519KeyIdentity } = require("@dfinity/identity");
const createHmac = require("create-hmac");

import { ERRORS } from "../../errors";
import { AccountCredentials } from "../../interfaces/account";
import { DERIVATION_PATH, ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO, HARDENED_OFFSET  } from "./constants";
import { Principal } from '@dfinity/agent/lib/cjs';
import { getLedgerActor } from "../dfx";
import { byteArrayToWordArray, generateChecksum, wordArrayToByteArray } from "../crypto";
import { derivePath, getPublicKey } from "../crypto/hdKeyManager";

export const extendKey = ({ key, chainCode }, index) => {
    const indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32BE(HARDENED_OFFSET + index, 0);
    const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer]);
    const I = createHmac('sha512', chainCode)
        .update(data)
        .digest();
    const IL = I.slice(0, 32);
    const IR = I.slice(32);
    return {
        key: IL,
        chainCode: IR,
    };
};

/*
    Used dfinity/keysmith/account/account.go as a base for the ID generation
*/
export const createAccountId = (principal: Principal, subAccount?: number) => {
    const sha = CryptoJS.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPERATOR);  // Internally parsed with UTF-8, like go does
    sha.update(byteArrayToWordArray(Uint8Array.from(principal.toBlob())));
    const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
    if (!!subAccount) {
        subBuffer.writeUInt32BE(subAccount || 0);
    }
    sha.update(byteArrayToWordArray(subBuffer));
    const hash = sha.finalize();

    /// While this is backed by an array of length 28, it's canonical representation
    /// is a hex string of length 64. The first 8 characters are the CRC-32 encoded
    /// hash of the following 56 characters of hex. Both, upper and lower case
    /// characters are valid in the input string and can even be mixed.
    /// [ic/rs/rosetta-api/ledger_canister/src/account_identifier.rs]
    const byteArray = wordArrayToByteArray(hash, 28);
    const checksum = generateChecksum(byteArray);
    const val = checksum + hash.toString();

    return val;
}

const deriveKey = (mnemonic: string, index = 0, password?: string) => {
    const hexSeed = bip39.mnemonicToSeedSync(mnemonic, password);
    const masterXKey = derivePath(DERIVATION_PATH, hexSeed, HARDENED_OFFSET + index);
    const childXKey = extendKey(masterXKey, 0);
    const grandchildXKey = extendKey(childXKey, index);
    
    return grandchildXKey;

}

const getAccountCredentials = (mnemonic: string, subAccount?: number, password?: string): AccountCredentials => {
    const { key } = deriveKey(mnemonic, subAccount || 0, password);
    // Identity has boths keys via getKeyPair and PID via getPrincipal
    const identity = Ed25519KeyIdentity.generate(key);
    const accountId = createAccountId(identity.getPrincipal(), subAccount);
    return {
        mnemonic,
        identity,
        accountId
    }
}

export const createAccount = (password?: string) : AccountCredentials => {
    const mnemonic = bip39.generateMnemonic();
    return getAccountCredentials(mnemonic, 0, password);
}

export const createAccountFromMnemonic = (mnemonic: string, accountId: number, password?: string) : AccountCredentials => {
    if (!mnemonic || !bip39.validateMnemonic(mnemonic)) {
        throw new Error(ERRORS.INVALID_MNEMONIC);
    }
    if (typeof accountId !== 'number' || accountId < 0) {
        throw new Error(ERRORS.INVALID_ACC_ID);
    }
    return getAccountCredentials(mnemonic, accountId, password);
}

// Queries first 10 accounts for the provided key
export const queryAccounts = async (secretKey: Uint8Array) => {
    const ledgerActor = await getLedgerActor(secretKey);
    const identity = Ed25519KeyIdentity.fromSecretKey(secretKey);
    const balances = {};
    for(let subAccount = 0; subAccount < 10; subAccount++) {
        const account = createAccountId(identity.getPrincipal(), subAccount);
        ledgerActor.account_balance_dfx({ account }).then((res) => {
            console.log("account balanace", res);
            balances[subAccount] = { accountId: account, balance: res.e8s };
          });
    }
    return balances;
};
