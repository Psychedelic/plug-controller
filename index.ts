import canisterIDLFactory from "./canister.did";

const { derivePath, getMasterKeyFromSeed }  = require('ed25519-hd-key');
const bip39  = require('bip39');
const pbkdf2  = require('pbkdf2');
const nacl  = require('tweetnacl');
const { TextDecoder }  = require('text-encoding');
const { HttpAgent, Actor }  = require('@dfinity/agent');
const fetch = require('node-fetch');

const seedFromMnemonic = (mnemonic: String) => pbkdf2.pbkdf2Sync(mnemonic.replace(' ', ''), 'Salt', 2048, 64, 'sha512')

const MESSAGE = 'This is a test message';
const DERIVATION_PATH = "m/44'/223'/0'";
const CANISTER_ID = 'rrkah-fqaaa-aaaaa-aaaaq-cai';

const mnemonic = bip39.generateMnemonic();
const hexSeed = seedFromMnemonic(mnemonic);
const { key: masterKey, chainCode } = getMasterKeyFromSeed(hexSeed);
const { key: childKey, chainCode: childChainCode } = derivePath(DERIVATION_PATH, hexSeed);


const { secretKey, publicKey } = nacl.sign.keyPair.fromSeed(masterKey);
const { secretKey: childSecret, publicKey: childPublic } = nacl.sign.keyPair.fromSeed(childKey);
console.log(secretKey);


const signed = nacl.sign(Buffer.from(MESSAGE, 'utf8'), secretKey);
console.log(`SIGNED: ${signed}`);

const opened = nacl.sign.open(signed, publicKey);
console.log(`Opened: ${ opened ? new TextDecoder().decode(opened) : 'Invalid public key'}`);

const generateMnemonic = async () => {
    const agent = await Promise.resolve(
        new HttpAgent({ host: 'http://localhost:59750/', fetch })
      ).then(async (agent) => {
        await agent.fetchRootKey();
        return agent;
      });
    const actor = Actor.createActor(canisterIDLFactory, { agent, canisterId: CANISTER_ID });
    const greeting = await actor.greet(mnemonic);
    return greeting;
}

generateMnemonic().then(res => console.log(res));