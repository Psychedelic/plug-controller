import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';

import PlugKeyRing from '.';
import { ERRORS } from '../errors';
import PlugWallet from '../PlugWallet';
import store from '../utils/storage/mock';

const TEST_PASSWORD = 'Somepassword1234';
const TEST_MNEMONIC = bip39.generateMnemonic();

describe('Plug KeyRing', () => {
  const testWallet = new PlugWallet({
    name: 'test',
    mnemonic: TEST_MNEMONIC,
    walletNumber: 0,
  });
  let keyRing: PlugKeyRing;

  beforeAll(async () => {
    await store.clear();
    keyRing = new PlugKeyRing();
  });

  beforeEach(async () => {
    await store.clear();
    keyRing = new PlugKeyRing();
  });

  describe('initialization', () => {
    it('should be empty and locked if not initialized', async () => {
      expect(() => keyRing.setCurrentPrincipal(testWallet)).toThrow(
        ERRORS.NOT_INITIALIZED
      );
      expect(() => keyRing.setCurrentPrincipal(testWallet)).toThrow(
        ERRORS.NOT_INITIALIZED
      );
      await expect(() => keyRing.unlock(TEST_PASSWORD)).rejects.toEqual(
        Error(ERRORS.NOT_INITIALIZED)
      );
      await expect(() => keyRing.createPrincipal()).rejects.toEqual(
        Error(ERRORS.NOT_INITIALIZED)
      );
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
  });

  describe('creation', () => {
    it('should create a new keyring and be locked by default', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
    it('should create a new keyring and expose state correctly', async () => {
      const { wallet } = await keyRing.create({ password: TEST_PASSWORD });
      expect(await keyRing.unlock(TEST_PASSWORD)).toEqual(true);

      const state = await keyRing.getState();
      expect(state.wallets.length).toEqual(1);

      const stateWallet = state.wallets[0];
      expect(stateWallet.toJSON()).toEqual(wallet.toJSON());
      expect(state.currentWalletId).toEqual(0);
      expect(state.password).toEqual(TEST_PASSWORD); // Should I expose this?
      expect(bip39.validateMnemonic(state.mnemonic as string)).toEqual(true);
    });
    it('should fail if not password was provided', async () => {
      await expect(() => keyRing.create({ password: '' })).rejects.toEqual(
        Error(ERRORS.PASSWORD_REQUIRED)
      );
    });
  });

  describe('import', () => {
    it('should import a keyring and expose state correctly', async () => {
      const wallet = await keyRing.importMnemonic({
        password: TEST_PASSWORD,
        mnemonic: TEST_MNEMONIC,
      });
      const unlocked = await keyRing.unlock(TEST_PASSWORD);
      expect(unlocked).toEqual(true);

      const state = await keyRing.getState();
      expect(state.wallets.length).toEqual(1);
      const stateWallet = state.wallets[0];
      expect(stateWallet.toJSON()).toEqual(wallet.toJSON());
      expect(state.currentWalletId).toEqual(0);
      expect(state.mnemonic).toEqual(TEST_MNEMONIC);
      expect(state.password).toEqual(TEST_PASSWORD);
      expect(bip39.validateMnemonic(state.mnemonic!)).toEqual(true);
    });
    it('should fail if not password or mnemonic were provided', async () => {
      await expect(() =>
        keyRing.importMnemonic({ password: '', mnemonic: TEST_MNEMONIC })
      ).rejects.toEqual(Error(ERRORS.PASSWORD_REQUIRED));
      await expect(() =>
        keyRing.importMnemonic({ password: TEST_PASSWORD, mnemonic: '' })
      ).rejects.toEqual(Error(ERRORS.INVALID_MNEMONIC));
    });
    it('should fail if the mnemonic is invalid', async () => {
      await expect(() =>
        keyRing.importMnemonic({
          password: TEST_PASSWORD,
          mnemonic: 'some test mnemonic',
        })
      ).rejects.toEqual(Error(ERRORS.INVALID_MNEMONIC));
    });
    it('should import the same wallet even with different passwords', async () => {
      const wallet = await keyRing.importMnemonic({
        mnemonic: TEST_MNEMONIC,
        password: TEST_PASSWORD,
      });
      const newWallet = await keyRing.importMnemonic({
        mnemonic: TEST_MNEMONIC,
        password: 'newpassword1',
      });
      expect(wallet.toJSON()).toEqual(newWallet.toJSON());
      expect(wallet.keys).toEqual(newWallet.keys);
      expect(wallet.principal).toEqual(newWallet.principal);
    });
  });

  describe('lock', () => {
    it('should create a keyring and be locked by default', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
    it('should import a keyring and be locked by default', async () => {
      await keyRing.importMnemonic({
        password: TEST_PASSWORD,
        mnemonic: TEST_MNEMONIC,
      });
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
    it('should unlock correctly with correct password', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);

      const state = await keyRing.getState();
      expect(state.wallets.length).toEqual(1);
      expect(state.currentWalletId).toEqual(0);
      expect(state.password).toEqual(TEST_PASSWORD);
    });
    it('should lock correctly when unlocked', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      keyRing.lock();
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
  });
  describe('storage', () => {
    it('should persist data encypted correctly after creating a new keyring', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      const state = await keyRing.getState();
      const encryptedState = CryptoJS.AES.encrypt(
        JSON.stringify(state),
        TEST_PASSWORD
      );
      const stored = store.get();
      expect(
        CryptoJS.AES.decrypt(encryptedState, TEST_PASSWORD).toString(
          CryptoJS.enc.Utf8
        )
      ).toEqual(
        CryptoJS.AES.decrypt(stored, TEST_PASSWORD).toString(CryptoJS.enc.Utf8)
      );
    });
    it('should persist data encypted correctly after importing a keyring', async () => {
      await keyRing.importMnemonic({
        mnemonic: TEST_MNEMONIC,
        password: TEST_PASSWORD,
      });
      await keyRing.unlock(TEST_PASSWORD);
      const state = await keyRing.getState();
      const encryptedState = CryptoJS.AES.encrypt(
        JSON.stringify(state),
        TEST_PASSWORD
      );
      const stored = store.get();
      expect(
        CryptoJS.AES.decrypt(encryptedState, TEST_PASSWORD).toString(
          CryptoJS.enc.Utf8
        )
      ).toEqual(
        CryptoJS.AES.decrypt(stored, TEST_PASSWORD).toString(CryptoJS.enc.Utf8)
      );
    });
    it('should persist data encypted correctly after creating a new principal', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      const state = await keyRing.getState();
      const encryptedState = CryptoJS.AES.encrypt(
        JSON.stringify(state),
        TEST_PASSWORD
      );
      const stored = store.get();
      expect(
        CryptoJS.AES.decrypt(encryptedState, TEST_PASSWORD).toString(
          CryptoJS.enc.Utf8
        )
      ).toEqual(
        CryptoJS.AES.decrypt(stored, TEST_PASSWORD).toString(CryptoJS.enc.Utf8)
      );
    });
  });
  describe('principal management', () => {
    it('should create new principals correctly when unlocked', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      let state = await keyRing.getState();
      expect(state.wallets.length).toEqual(2);
      await keyRing.createPrincipal();
      state = await keyRing.getState();
      expect(state.wallets.length).toEqual(3);
    });
    it('should fail to create new principals when locked', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await expect(() => keyRing.createPrincipal()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
    it('should set the current principal correctly', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      const wallet = await keyRing.createPrincipal();
      const state = await keyRing.getState();
      expect(state.currentWalletId).toEqual(0);
      keyRing.setCurrentPrincipal(wallet);
      expect(state.currentWalletId).toEqual(wallet.walletNumber);
    });
    it('should create new wallets with a default name', async () => {
      const { wallet } = await keyRing.create({ password: TEST_PASSWORD });
      expect(wallet.name).toEqual('Main IC Wallet');
      const newWallet = await keyRing.importMnemonic({
        mnemonic: TEST_MNEMONIC,
        password: TEST_PASSWORD,
      });
      expect(newWallet.name).toEqual('Main IC Wallet');
    });
    it('should change the wallets name correctly', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      await keyRing.editPrincipal(0, { name: 'New name1' });
      await keyRing.editPrincipal(1, { name: 'New name2' });
      await keyRing.editPrincipal(2, { name: 'New name3' });

      const { wallets } = await keyRing.getState();
      expect(wallets[0].name).toEqual('New name1');
      expect(wallets[1].name).toEqual('New name2');
      expect(wallets[2].name).toEqual('New name3');
    });
    it('should fail to change an invalid wallet', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      expect(() =>
        keyRing.editPrincipal(10, { name: 'New name', emoji: 'test' })
      ).toThrow(ERRORS.INVALID_WALLET_NUMBER);
      expect(() =>
        keyRing.editPrincipal(-1, { name: 'New name', emoji: 'test' })
      ).toThrow(ERRORS.INVALID_WALLET_NUMBER);
      expect(() =>
        keyRing.editPrincipal(1.231, { name: 'New name', emoji: 'test' })
      ).toThrow(ERRORS.INVALID_WALLET_NUMBER);
    });
    it('should change the wallet icon correctly', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      await keyRing.editPrincipal(0, { emoji: '123' });
      await keyRing.editPrincipal(1, { emoji: 'New emoji2' });
      await keyRing.editPrincipal(2, { emoji: 'New name3' });

      const { wallets } = await keyRing.getState();
      expect(wallets[0].icon).toEqual('123');
      expect(wallets[1].icon).toEqual('New emoji2');
      expect(wallets[2].icon).toEqual('New name3');
    });
  });
});
