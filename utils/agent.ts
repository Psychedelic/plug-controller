import { HttpAgent } from "@dfinity/agent";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import fetch from "cross-fetch";
import { config } from 'dotenv';

config();

const identity = Ed25519KeyIdentity.generate();

const agent = Promise.resolve(
    new HttpAgent({ host: process.env.DFX_HOST || 'https://ic0.app', fetch })
  ).then(async (agent) => {
    await agent.fetchRootKey();
    return agent;
  });

export const principal = identity.getPrincipal();
export default agent;