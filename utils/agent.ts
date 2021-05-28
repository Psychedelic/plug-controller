import { HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import fetch from "cross-fetch";
import { config } from 'dotenv';

config();

export const createAgent = async (secretKey: Uint8Array) => {
    const identity = secretKey 
        ? Ed25519KeyIdentity.fromSecretKey(secretKey) 
        : Ed25519KeyIdentity.generate();
    const agent = await Promise.resolve(
        new HttpAgent({ host: process.env.DFX_HOST || 'https://ic0.app', fetch, identity })
        ).then(async (agent) => {
        await agent.fetchRootKey();
        return agent;
        });
    return agent;
}