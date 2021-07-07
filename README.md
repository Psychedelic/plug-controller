![](https://storageapi.fleek.co/fleek-team-bucket/plug.png)


# Plug Controller - Controller functions for the Plug Extension
[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Discord](https://img.shields.io/badge/Discord-Channel-blue)](https://discord.gg/yVEcEzmrgm)

## Introduction

The Plug Controller is a package that provides utility & logic to the Plug browser wallet extension, as well as the account creation and management. It handles the interactions between the extension and the Internet Computer as users interact with accounts, balances, canisters, and the network.

## Installation

`npm install @psychedelic/plug-controller`

## Plug KeyRing
A Plug Keyring is a class that manages the user's accounts and allow you to create/import a mnemonic and its keypair. 
```
import { PlugKeyRing } from '@psychedelic/plug-controller';

const keyRing = new PlugKeyRing();

// Initialize keyring and load state from extension storage
await keyRing.load();
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