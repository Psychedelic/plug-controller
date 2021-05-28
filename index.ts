import canisterIDLFactory from "./canister.did";
import nacl from 'tweetnacl';
import { createAccount } from './utils/account';
import { TextDecoder } from 'text-encoding';
import { Actor } from '@dfinity/agent';
import dfxAgent from './utils/agent';
import { config } from 'dotenv';

config();

const { mnemonic, publicKey, secretKey } = createAccount();

const signTest = (message: string) => {
  const signed = nacl.sign(Buffer.from(message, 'utf8'), secretKey);
  console.log(`SIGNED: ${signed}`);
  
  const opened = nacl.sign.open(signed, publicKey);
  console.log(`Opened: ${ opened ? new TextDecoder().decode(opened) : 'Invalid public key'}`);
}

const dfxConnect = async () => {
    const agent = await dfxAgent;
    const actor = Actor.createActor(canisterIDLFactory, { agent, canisterId: process.env.CANISTER_ID || '' });
    const greeting = await actor.greet(mnemonic);
    return greeting;
}


signTest('This is a message');
dfxConnect().then(res => console.log(res));