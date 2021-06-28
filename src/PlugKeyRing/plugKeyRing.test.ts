import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import RandomBigInt from 'random-bigint';

import PlugKeyRing from '.';
import { ERRORS } from '../errors';
import { GetTransactionsResponse } from '../interfaces/nns_uid';
import PlugWallet from '../PlugWallet';
import { createAgent } from '../utils/dfx';
import store from '../utils/storage/mock';

const mockSendICP = jest.fn();

jest.mock('../utils/dfx', () => {
  return {
    createAgent: jest.fn(),
    createLedgerActor: () => ({ sendICP: mockSendICP }),
  };
});

const TEST_PASSWORD = 'Somepassword1234';
const TEST_MNEMONIC = bip39.generateMnemonic();

const createManyWallets = async (keyRing: PlugKeyRing): Promise<number> => {
  const many = Math.round(Math.random() * 20) + 2;
  for (let i = 1; i < many; i += 1) {
    await keyRing.createPrincipal();
  }
  return many;
};

const createManyTransactions = (): GetTransactionsResponse => {
  const many = Math.round(Math.random() * 20) + 2;
  const transactions: GetTransactionsResponse = { total: 0, transactions: [] };
  for (let i = 1; i < many; i += 1) {
    transactions.transactions.push({
      memo: RandomBigInt(32),
      timestamp: { timestamp_nanos: RandomBigInt(32) },
      block_height: RandomBigInt(32),
      transfer: { Burn: { amount: RandomBigInt(32) } },
    });
  }
  return transactions;
};

describe('Plug KeyRing', () => {
  const testWallet = new PlugWallet({
    name: 'test',
    mnemonic: TEST_MNEMONIC,
    walletNumber: 0,
  });
  let keyRing: PlugKeyRing;
  const cleanup = async (): Promise<void> => {
    await store.clear();
    keyRing = new PlugKeyRing();
  };

  beforeAll(cleanup);
  beforeEach(cleanup);
  afterEach(cleanup);

  describe('initialization', () => {
    it('should be empty and locked if not initialized', async () => {
      await expect(() =>
        keyRing.setCurrentPrincipal(testWallet)
      ).rejects.toEqual(Error(ERRORS.NOT_INITIALIZED));
      await expect(() => keyRing.unlock(TEST_PASSWORD)).rejects.toEqual(
        Error(ERRORS.NOT_INITIALIZED)
      );
      await expect(() => keyRing.createPrincipal()).rejects.toEqual(
        Error(ERRORS.NOT_INITIALIZED)
      );
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.NOT_INITIALIZED)
      );
      expect(keyRing.isInitialized).toBe(false);
      expect(keyRing.isUnlocked).toBe(false);
    });
  });

  describe('creation', () => {
    it('should create a new keyring and be locked by default', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      expect(keyRing.isInitialized).toBe(true);
      expect(keyRing.isUnlocked).toBe(false);
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
    it('should create a new keyring and expose state correctly', async () => {
      const { wallet } = await keyRing.create({ password: TEST_PASSWORD });
      expect(await keyRing.unlock(TEST_PASSWORD)).toEqual(true);
      expect(keyRing.isInitialized).toBe(true);
      expect(keyRing.isUnlocked).toBe(true);

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
      expect(keyRing.isInitialized).toBe(true);
      const unlocked = await keyRing.unlock(TEST_PASSWORD);

      expect(keyRing.isUnlocked).toBe(true);
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
      expect(keyRing.isInitialized).toBe(false);
    });
    it('should fail if the mnemonic is invalid', async () => {
      await expect(() =>
        keyRing.importMnemonic({
          password: TEST_PASSWORD,
          mnemonic: 'some test mnemonic',
        })
      ).rejects.toEqual(Error(ERRORS.INVALID_MNEMONIC));
      expect(keyRing.isInitialized).toBe(false);
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
      expect(keyRing.isInitialized).toBe(true);
      expect(keyRing.isUnlocked).toBe(false);
    });
    it('should import a keyring and be locked by default', async () => {
      await keyRing.importMnemonic({
        password: TEST_PASSWORD,
        mnemonic: TEST_MNEMONIC,
      });
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
      expect(keyRing.isUnlocked).toBe(false);
    });
    it('should unlock correctly with correct password', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      expect(keyRing.isUnlocked).toBe(true);

      const state = await keyRing.getState();
      expect(state.wallets.length).toEqual(1);
      expect(state.currentWalletId).toEqual(0);
      expect(state.password).toEqual(TEST_PASSWORD);
    });
    it('should fail to unlock with incorrect password', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      const unlocked = await keyRing.unlock('false1234');
      expect(unlocked).toBe(false);
      expect(keyRing.isUnlocked).toBe(false);
      await expect(() => keyRing.getState()).rejects.toEqual(
        Error(ERRORS.STATE_LOCKED)
      );
    });
    it('should lock correctly when unlocked', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      expect(keyRing.isUnlocked).toBe(true);
      await keyRing.lock();
      expect(keyRing.isUnlocked).toBe(false);
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
      const { vault: stored, isInitialized } = store.get();
      expect(
        CryptoJS.AES.decrypt(encryptedState, TEST_PASSWORD).toString(
          CryptoJS.enc.Utf8
        )
      ).toEqual(
        CryptoJS.AES.decrypt(stored, TEST_PASSWORD).toString(CryptoJS.enc.Utf8)
      );
      expect(isInitialized).toEqual(true);
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
      const { vault: stored, isInitialized } = store.get();
      expect(
        CryptoJS.AES.decrypt(encryptedState, TEST_PASSWORD).toString(
          CryptoJS.enc.Utf8
        )
      ).toEqual(
        CryptoJS.AES.decrypt(stored, TEST_PASSWORD).toString(CryptoJS.enc.Utf8)
      );
      expect(isInitialized).toEqual(true);
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
      const { vault: stored, isInitialized } = store.get();
      expect(
        CryptoJS.AES.decrypt(encryptedState, TEST_PASSWORD).toString(
          CryptoJS.enc.Utf8
        )
      ).toEqual(
        CryptoJS.AES.decrypt(stored, TEST_PASSWORD).toString(CryptoJS.enc.Utf8)
      );
      expect(isInitialized).toEqual(true);
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
    it('should create many new principals correctly', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      const state = await keyRing.getState();
      expect(state.wallets.length).toEqual(5);
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
      await keyRing.setCurrentPrincipal(wallet);
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
      await expect(() =>
        keyRing.editPrincipal(10, { name: 'New name', emoji: 'test' })
      ).rejects.toEqual(Error(ERRORS.INVALID_WALLET_NUMBER));
      await expect(() =>
        keyRing.editPrincipal(-1, { name: 'New name', emoji: 'test' })
      ).rejects.toEqual(Error(ERRORS.INVALID_WALLET_NUMBER));
      await expect(() =>
        keyRing.editPrincipal(1.231, { name: 'New name', emoji: 'test' })
      ).rejects.toEqual(Error(ERRORS.INVALID_WALLET_NUMBER));
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

  describe('get balance', () => {
    const balances = {};
    let walletsCreated = 0;
    beforeEach(async () => {
      keyRing = new PlugKeyRing();
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      walletsCreated = await createManyWallets(keyRing);
      const state = await keyRing.getState();
      state.wallets.forEach(wallet => {
        const randomBalance = RandomBigInt(32);
        balances[wallet.walletNumber] = randomBalance;
        jest.spyOn(wallet, 'getBalance').mockImplementation(
          jest.fn(() => {
            return Promise.resolve(randomBalance);
          })
        );
      });
    });

    test('get default balance', async () => {
      expect(await keyRing.getBalance()).toBe(balances[0]);
    });

    test('get specific balance', async () => {
      const ind = Math.round(Math.random() * (walletsCreated - 1));

      expect(await keyRing.getBalance(ind)).toBe(balances[ind]);
    });

    test('get error with invalid wallet numbers', async () => {
      await expect(keyRing.getBalance(-2)).rejects.toThrow(
        ERRORS.INVALID_WALLET_NUMBER
      );
      await expect(keyRing.getBalance(walletsCreated + 2)).rejects.toThrow(
        ERRORS.INVALID_WALLET_NUMBER
      );
    });
  });

  describe('get transactions', () => {
    const transactions = {};
    let walletsCreated = 0;
    beforeEach(async () => {
      keyRing = new PlugKeyRing();
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      walletsCreated = await createManyWallets(keyRing);
      const state = await keyRing.getState();
      state.wallets.forEach(wallet => {
        const randomTransactions = createManyTransactions();
        transactions[wallet.walletNumber] = randomTransactions;
        jest.spyOn(wallet, 'getTransactions').mockImplementation(
          jest.fn(() => {
            return Promise.resolve(randomTransactions);
          })
        );
      });
    });

    test('get default balance', async () => {
      expect(await keyRing.getTransactions()).toBe(transactions[0]);
    });

    test('get specific balance', async () => {
      const ind = Math.round(Math.random() * (walletsCreated - 1));

      expect(await keyRing.getTransactions(ind)).toBe(transactions[ind]);
    });

    test('get error with invalid wallet numbers', async () => {
      await expect(keyRing.getTransactions(-2)).rejects.toThrow(
        ERRORS.INVALID_WALLET_NUMBER
      );
      await expect(keyRing.getTransactions(walletsCreated + 2)).rejects.toThrow(
        ERRORS.INVALID_WALLET_NUMBER
      );
    });
  });

  describe('sendICP', () => {
    let walletsCreated = 0;
    beforeEach(async () => {
      keyRing = new PlugKeyRing();
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      walletsCreated = await createManyWallets(keyRing);
    });

    it('call create agent with secret key', async () => {
      const { wallets, currentWalletId } = await keyRing.getState();
      const amount = RandomBigInt(32);
      const ind = Math.round(Math.random() * (walletsCreated - 1));
      const to = wallets[ind].principal;
      const defaultWallet = currentWalletId || 0;

      await keyRing.sendICP(to.toString(), amount);
      expect(createAgent).toHaveBeenCalled();
      expect((createAgent as jest.Mock).mock.calls[0][0].secretKey).toEqual(
        wallets[defaultWallet]['identity'].getKeyPair().secretKey
      );
    });

    it('call sendICP with to principal', async () => {
      const { wallets } = await keyRing.getState();
      const amount = RandomBigInt(32);
      const ind = Math.round(Math.random() * (walletsCreated - 1));
      const to = wallets[ind].principal;

      await keyRing.sendICP(to.toString(), amount);
      expect(createAgent).toHaveBeenCalled();
      expect(mockSendICP.mock.calls[0][0].amount).toEqual(amount);
    });

    it('call sendICP with correct amount', async () => {
      const { wallets } = await keyRing.getState();
      const amount = RandomBigInt(32);
      const ind = Math.round(Math.random() * (walletsCreated - 1));
      const to = wallets[ind].principal;

      await keyRing.sendICP(to.toString(), amount);
      expect(createAgent).toHaveBeenCalled();
      expect(mockSendICP.mock.calls[0][0].to).toEqual(to.toString());
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
