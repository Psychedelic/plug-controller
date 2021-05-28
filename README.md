![](https://fleek-team-bucket.storage.fleek.co/Blog%20Inline/fleekcli.png)

# Plug Wallet Controller - Controller functions for Plug Wallet Extension
[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Dev Slack](https://img.shields.io/badge/Dev%20Slack-Channel-blue)](https://slack.fleek.co/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/FleekHQ/space-sdk/blob/master/LICENSE)

## Introduction

Plug Wallet Controller is a package intended to provide utility to Plug Wallet's Chrome Extension for the Internet Computer.

## Installation & usage

- Installation: `npm install @fleekhq/plug-wallet-controller`
- Usage: `import plugWalletController from '@fleekhq/plug-wallet-controller'`
## Available functions

### Account utilities
**Create account credentials**
- Generate a new mnemonic and associated key pair
```
const { secretKey, publicKey, mnemonic } = createAccountCredentials();
```

**Generate Keys from Mnemonic**
- Generates a key pair from a mnemonic `string`.
```
mnemonic = 'pulp similar wink spice stove stem height attack swear chest meadow quality'

const { secretKey, publicKey } = createKeysFromMnemonic(mnemonic);
```


### DFX utilities
**Create DFX Agent**
- Creates a Dfinity Agent with a provided privateKey `string` used to create an identity in the network.
```
const agent = await createAgent(secretKey);
```