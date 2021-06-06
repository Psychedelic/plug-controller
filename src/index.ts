const { createAccount, createAccountFromMnemonic, queryAccounts } = require('./modules/account');
const { createAgent, getLedgerActor, getWalletActor } = require('./modules/dfx');
const PlugKeyRing = require('./plugKeyRing');

export const account = {
    createAccount,
    createAccountFromMnemonic,
    queryAccounts
}

export const dfx = {
    createAgent,
    getLedgerActor,
    getWalletActor
}

export default {
    account,
    dfx,
    PlugKeyRing
}