import { createAccount, createAccountFromMnemonic } from './modules/account';
import { createAgent, getLedgerActor } from './modules/dfx';

export default {
    createAccount,
    createAccountFromMnemonic,
    createAgent,
    getLedgerActor
}