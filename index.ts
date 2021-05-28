import { sign } from 'tweetnacl';
import { TextDecoder } from 'text-encoding';
import { Actor } from '@dfinity/agent';
import { config } from 'dotenv';

import { createAccountCredentials } from './utils/account';
import { createAgent } from './utils/agent';
import canisterIDLFactory from './canister.did';

config();

const { mnemonic, publicKey, secretKey } = createAccountCredentials();

const signTest = (message: string) => {
  const signed = sign(Buffer.from(message, 'utf8'), secretKey);
  console.log(`SIGNED: ${signed}`);
  
  const opened = sign.open(signed, publicKey);
  console.log(`Opened: ${ opened ? new TextDecoder().decode(opened) : 'Invalid public key'}`);
}

const dfxConnect = async () => {
    const agent = await createAgent(secretKey);
    const actor = Actor.createActor(canisterIDLFactory, { agent, canisterId: process.env.CANISTER_ID || '' });
    const greeting = await actor.greet(mnemonic);
    return greeting;
}


signTest('This is a message');
dfxConnect().then(res => console.log(res));