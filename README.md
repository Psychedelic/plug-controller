![](https://storageapi.fleek.co/fleek-team-bucket/plug-banner.png)


# Plug Controller - Controller functions for the Plug Extension
[![Fleek](https://img.shields.io/badge/Made%20by-Fleek-blue)](https://fleek.co/)
[![Discord](https://img.shields.io/badge/Discord-Channel-blue)](https://discord.gg/yVEcEzmrgm)

## Introduction

The Plug Controller is a package that provides utility & logic to the Plug browser wallet extension, as well as the account creation and management. It handles the interactions between the extension and the Internet Computer as users interact with accounts, balances, canisters, and the network.

## Installation

```
npm install @psychedelic/plug-controller
```

To install the package you need to be authenticated to Github via `npm login`, ensure that you have:

- A personal access token (create one [here]((https://github.com/settings/tokens))) with the `repo` and `read:packages` scopes to login to the [GitHub Package Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

- Have authenticated via `npm login`, using the **personal access token** as your **password**:

```
npm login --registry=https://npm.pkg.github.com --scope=@Psychedelic
```

## Plug KeyRing
A Plug Keyring is a class that manages the user's accounts and allow you to create/import a mnemonic and its keypair. 
```
import PlugController from '@psychedelic/plug-controller';

const keyRing = new PlugController.PlugKeyRing();

// Initialize keyring and load state from extension storage
await keyRing.init();
```

### Keyring Creation
```
// Creates the keyring and returns the default wallet
const wallet: PlugWallet = await keyRing.create(password);
```

### Mnemonic Import
```
// Creates the keyring using the provided mnemonic and returns the default wallet
const wallet: PlugWallet = await keyRing.importFromMnemonic(mnemonic, password);
```
