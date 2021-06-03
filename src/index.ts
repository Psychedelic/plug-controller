const { createAccount, createAccountFromMnemonic } = require('./modules/account');
const { createAgent, getLedgerActor, getWalletActor } = require('./modules/dfx');

export const account = {
    createAccount,
    createAccountFromMnemonic
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