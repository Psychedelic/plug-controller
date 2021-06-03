const { createAccount, createAccountFromMnemonic, queryAccounts } = require('./modules/account');
const { createAgent, getLedgerActor, getWalletActor } = require('./modules/dfx');

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
    dfx
}