![](https://storageapi.fleek.co/rocky-fleek-team-bucket/plug-npm.png)


# Plug Wallet Controller - Controller functions for Plug Wallet Extension
[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Dev Slack](https://img.shields.io/badge/Dev%20Slack-Channel-blue)](https://slack.fleek.co/)
[![License](https://img.shields.io/badge/License-MIT-green)](https://github.com/FleekHQ/space-sdk/blob/master/LICENSE)

## Introduction

Plug Wallet Controller is a package intended to provide utility to Plug Wallet's Chrome Extension for the Internet Computer.

## Requirements

Authenticate to Github registry by:

```
npm login --registry=https://npm.pkg.github.com --scope=@Psychedelic
```

This because the packages under the organisation scope [@Psychedelic](https://github.com/Psychedelic) are published under the [Psychedelic packages](https://github.com/orgs/Psychedelic/packages), as you can see in the `.npmrc`:

```
@psychedelic:registry=https://npm.pkg.github.com
```

Choose the github username that you use as a member of @Psychedelic and for the password, a [personal access token](https://github.com/settings/tokens), with the  `read:packages` scope (permission) and `write:packages`, to publish it.

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