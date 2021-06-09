![](https://storageapi.fleek.co/rocky-fleek-team-bucket/plug-npm.png)


# Plug Wallet Controller - Controller functions for Plug Wallet Extension
[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Dev Slack](https://img.shields.io/badge/Dev%20Slack-Channel-blue)](https://slack.fleek.co/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/FleekHQ/space-sdk/blob/master/LICENSE)

## Introduction

Plug Wallet Controller is a package intended to provide utility to Plug Wallet's Chrome Extension for the Internet Computer.

## Installation

`npm install @psychedelic/plug-controller`

## Plug KeyRing
A Plug Keyring is a class that manages the user's accounts and allow you to create/import a mnemonic and its keypair. 
```
import { PlugKeyRing } from '@psychedelic/plug-controller';

const keyRing = new PlugKeyRing();

// Initialize keyring and load state from extension storage
await keyRing.init();
```

### Keyring Creation
```
// Creates the keyring and returns the default wallet
const wallet: PlugWallet = keyRing.create(password);
```

### Mnemonic Import
```
// Creates the keyring using the provided mnemonic and returns the default wallet
const wallet: PlugWallet = keyRing.importFromMnemonic(mnemonic, password);
```