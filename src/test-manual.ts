import { sign } from 'tweetnacl';
import { TextDecoder } from 'text-encoding';
import { Actor } from '@dfinity/agent';
import { config } from 'dotenv';

import { createAccount, createAccountFromMnemonic } from './utils/account';
import { createAgent } from './utils/dfx';
import canisterIDLFactory from './idls/canister.did';

if (process.env.NODE_ENV !== 'production') config();

const signTest = (message: string) => {

  const { publicKey, secretKey } = createAccount();
  const signed = sign(Buffer.from(message, 'utf8'), secretKey);
  console.log(`SIGNED: ${signed}`);
  
  const opened = sign.open(signed, publicKey);
  console.log(`Opened: ${ opened ? new TextDecoder().decode(opened) : 'Invalid public key'}`);
}

const newAccountTest = () => {
  const account = createAccount();
  console.log('ACCOUNT:');
  console.log(account);

  const newAccount = createAccountFromMnemonic(account.mnemonic, 1);
  console.log('SUB ACCOUNT 1: ');
  console.log(newAccount);
}

const dfxConnect = async () => {
    const { mnemonic, secretKey } = createAccount();
    const agent = await createAgent(secretKey);
    const actor = Actor.createActor(canisterIDLFactory, { agent, canisterId: process.env.CANISTER_ID || '' });
    const greeting = await actor.greet(mnemonic);
    return greeting;
}

dfxConnect();
signTest('A test!');
newAccountTest();