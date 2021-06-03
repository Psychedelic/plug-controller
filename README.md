![](https://fleek-team-bucket.storage.fleek.co/Blog%20Inline/fleekcli.png)

# Plug Wallet Controller - Controller functions for Plug Wallet Extension
[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Dev Slack](https://img.shields.io/badge/Dev%20Slack-Channel-blue)](https://slack.fleek.co/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/FleekHQ/space-sdk/blob/master/LICENSE)

## Introduction

Plug Wallet Controller is a package intended to provide utility to Plug Wallet's Chrome Extension for the Internet Computer.

## Installation & usage

- Installation: `npm install @fleekhq/plug-wallet-controller`
- Usage: `import plugWalletController from '@fleekhq/plug-wallet-controller'` or `import { account, dfx } from '@fleekhq/plug-wallet-controller';`
## Available functions

### Account utilities
**Create account credentials**
- Generate a new mnemonic and associated IC identity
```
const { identity, mnemonic } = createAccount();
```

**Generate SubAccount from Mnemonic**
- Generates an account from a mnemonic `string` and an account ID `number`. The sub-account with id 0 corresponds to the main account.
```
mnemonic = 'pulp similar wink spice stove stem height attack swear chest meadow quality'

const { identity } = createAccountFromMnemonic(mnemonic, 1);
```


### DFX utilities
**Create DFX Agent**
- Creates a Dfinity Agent with a provided privateKey `string` used to create an identity in the network.
```
const agent = await createAgent(secretKey);
```


**Get Ledger Actor**
- Generates an actor to interact with the NNS Ledger with a provided privateKey `string`.
```
const agent = await getLedgerActor(secretKey);
```


**Get Wallet Actor**
- Generates an actor to interact with a wallet on the network with a provided canisterId `string` and the user's privateKey `string`.
```
const agent = await getWalletActor(secretKey);
```