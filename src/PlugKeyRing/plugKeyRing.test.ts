import PlugKeyRing from '.';
import { ERRORS } from '../errors';
import PlugWallet from '../PlugWallet';
import store from '../utils/storage/mock';

const bip39 = require('bip39');
const CryptoJS = require('crypto-js');

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
    it('should be empty if not initialized', async () => {
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

      const stateWallet = state.wallets[0] as PlugWallet;
      expect(stateWallet.toJSON()).toEqual(wallet.toJSON());
      expect(state.currentWalletId).toEqual(0);
      expect(state.password).toEqual(TEST_PASSWORD); // Should I expose this?
      expect(bip39.validateMnemonic(state.mnemonic!)).toEqual(true);
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
      const stateWallet = state.wallets[0] as PlugWallet;
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
      await keyRing.createPrincipal();
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
  });
  describe('name management', () => {
    // TODO
  });
});
