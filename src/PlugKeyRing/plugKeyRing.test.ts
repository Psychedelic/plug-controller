/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { Principal } from '@dfinity/principal';
import fetch from 'cross-fetch';
import {
  getTokenActor,
  getCachedUserNFTs,
  getNFTActor,
  NFTDetails,
} from '@psychedelic/dab-js';

import PlugKeyRing from '.';
import { ERRORS } from '../errors';
import PlugWallet from '../PlugWallet';
import { createAgent } from '../utils/dfx';
import store from '../utils/storage/mock';
import { getAccountId, createAccountFromMnemonic } from '../utils/account';
import { TOKENS } from '../constants/tokens';
import { GetTransactionsResponse } from '../interfaces/transactions';
import { Mainnet } from './modules/NetworkModule/Network';
import { Types } from '../utils/account/constants';

jest.mock('@psychedelic/dab-js');

const mockSendICP = jest.fn();

jest.mock('../utils/dfx', () => {
  return {
    createAgent: jest.fn(() => ({})),
    createLedgerActor: (): { sendICP: jest.Mock<any, any> } => ({
      sendICP: mockSendICP,
    }),
  };
});

const mockedSendToken = jest.fn(({ amount }: any) => ({
  amount,
}));

const mockedTransferNFT = jest.fn();

const mockedICPunk = {
  index: BigInt(10),
  canister: 'qcg3w-tyaaa-aaaah-qakea-cai',
  name: 'IC Punk# 10',
  url: 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/10',
  metadata: {
    index: BigInt(10),
    name: 'IC Punk# 10',
    url: 'https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/10',
    owner: Principal.from(
      'ogkan-uvha2-mbm2l-isqcz-odcvg-szdx6-qj5tg-ydzjf-qrwe2-lbzwp-7qe'
    ),
    desc: 'string',
    properties: [],
  },
};

const mockdeNFTCollection = {
  name: 'IC Punks',
  canisterId: 'qcg3w-tyaaa-aaaah-qakea-cai',
  standard: 'ICPunk',
  tokens: [mockedICPunk],
};

(getTokenActor as jest.Mock).mockReturnValue({
  getMetadata: jest.fn(() => ({
    fungible: { symbol: 'WTC', decimals: 5, name: 'Wrapped Cycles' },
  })),
  getBalance: jest.fn(() => ({
    value: '1000',
    decimals: 8,
  })),
  send: mockedSendToken,
});

(getCachedUserNFTs as jest.Mock).mockReturnValue(
  Promise.resolve([mockdeNFTCollection])
);

(getNFTActor as jest.Mock).mockReturnValue({
  transfer: mockedTransferNFT,
});

const TEST_PASSWORD = 'Somepassword1234';
const TEST_MNEMONIC = bip39.generateMnemonic();

const createManyWallets = async (
  keyRing: PlugKeyRing,
  mockingMethod?: (wallet: PlugWallet) => void
): Promise<number> => {
  const many = Math.round(Math.random() * 20) + 2;
  for (let i = 0; i < many; i += 1) {
    const wallet = await keyRing.createPrincipal(); // eslint-disable-line
    if (mockingMethod) await mockingMethod(wallet);
  }
  return many;
};

const createManyTransactions = (): GetTransactionsResponse => {
  const many = Math.round(Math.random() * 20) + 2;
  const transactions: GetTransactionsResponse = { total: 0, transactions: [] };
  for (let i = 0; i < many; i += 1) {
    transactions.transactions.push({
      timestamp: BigInt(0),
      hash: '0',
      details: {
        from: 'string',
        to: 'string',
        amount: BigInt(1000),
        currency: { symbol: 'ICP', decimals: 8 },
        fee: {
          amount: BigInt(1000),
          currency: { symbol: 'ICP', decimals: 8 },
        },
        status: 'COMPLETED',
      },
      type: 'SEND',
      caller: 'stirng',
    });
    transactions.transactions.push({
      timestamp: BigInt(0),
      hash: '0',
      details: {
        from: 'string',
        to: 'string',
        amount: BigInt(1000),
        currency: { symbol: 'XTC', decimals: 5 },
        fee: {
          amount: BigInt(1000),
          currency: { symbol: 'XTC', decimals: 5 },
        },
        status: 'COMPLETED',
      },
      caller: 'string',
      type: 'SEND',
    });
  }
  return transactions;
};

describe('Plug KeyRing', () => {
  const { identity } = createAccountFromMnemonic(TEST_MNEMONIC, 0);
  const testWallet = new PlugWallet({
    name: 'test',
    walletId: '0',
    orderNumber: 0,
    fetch,
    network: new Mainnet({}, fetch),
    type: Types.mnemonic,
    identity,
  });
  let keyRing: PlugKeyRing;
  const cleanup = async (): Promise<void> => {
    await store.clear();
    keyRing = new PlugKeyRing(store);
  };

  beforeAll(cleanup);
  beforeEach(cleanup);
  afterEach(cleanup);

  describe('initialization', () => {
    it('should be empty and locked if not initialized', async () => {
      await expect(() =>
        keyRing.setCurrentPrincipal(testWallet.walletId)
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
      expect(stateWallet).toEqual(wallet.toJSON());
      expect(state.password).toEqual(TEST_PASSWORD);
      const mnemonic = await keyRing.getMnemonic(state.password as string);
      expect(bip39.validateMnemonic(mnemonic as string)).toEqual(true);
    });
    it('should fail if not password was provided', async () => {
      await expect(() => keyRing.create({ password: '' })).rejects.toEqual(
        Error(ERRORS.PASSWORD_REQUIRED)
      );
    });
  });

  describe('import', () => {
    it('should import a keyring and expose state correctly', async () => {
      const { wallet } = await keyRing.importMnemonic({
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
      expect(stateWallet).toEqual(wallet.toJSON());
      const mnemonic = await keyRing.getMnemonic(state.password as string);
      expect(mnemonic).toEqual(TEST_MNEMONIC);
      expect(state.password).toEqual(TEST_PASSWORD);
      expect(bip39.validateMnemonic(mnemonic!)).toEqual(true);
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
      const { wallet } = await keyRing.importMnemonic({
        mnemonic: TEST_MNEMONIC,
        password: TEST_PASSWORD,
      });
      const { wallet: newWallet } = await keyRing.importMnemonic({
        mnemonic: TEST_MNEMONIC,
        password: 'newpassword1',
      });
      expect(wallet.toJSON()).toEqual(newWallet.toJSON());
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
      const { currentWalletId, ...state } = await keyRing.getState();
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
      const { currentWalletId, ...state } = await keyRing.getState();
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
      const { currentWalletId, ...state } = await keyRing.getState();
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
    it('should persist data encypted correctly after registering a new token', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.registerToken({
        canisterId: '5ymop-yyaaa-aaaah-qaa4q-cai',
        standard: 'xtc',
      }); // register XTC
      const { currentWalletId, ...state } = await keyRing.getState();
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
      await keyRing.setCurrentPrincipal(wallet.walletId);
      expect(keyRing.currentWalletId).toEqual(wallet.walletId);
    });
    it('should fail to set invalid current principal ', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await expect(() => keyRing.setCurrentPrincipal('1')).rejects.toEqual(
        new Error(ERRORS.INVALID_WALLET_NUMBER)
      );
      await expect(() => keyRing.setCurrentPrincipal('-2')).rejects.toEqual(
        new Error(ERRORS.INVALID_WALLET_NUMBER)
      );
      await expect(() => keyRing.setCurrentPrincipal('1.2')).rejects.toEqual(
        new Error(ERRORS.INVALID_WALLET_NUMBER)
      );
    });
    it('should create new wallets with a default name', async () => {
      const { wallet } = await keyRing.create({ password: TEST_PASSWORD });
      expect(wallet.name).toEqual('Account 1');
      const { wallet: newWallet } = await keyRing.importMnemonic({
        mnemonic: TEST_MNEMONIC,
        password: TEST_PASSWORD,
      });
      expect(newWallet.name).toEqual('Account 1');
    });
    it('should create new wallets with a correct name and emoji', async () => {
      const { wallet } = await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      const wallet2 = await keyRing.createPrincipal({
        name: 'My new wallet',
        icon: ':smile:',
      }); // TODO: TS does not like emojis, but they are unicode strings
      expect(wallet2.name).toEqual('My new wallet');
      expect(wallet2.icon).toEqual(':smile:');
      const wallet3 = await keyRing.createPrincipal({
        name: 'My third wallet',
      }); // TODO: TS does not like emojis, but they are unicode strings
      expect(wallet3.name).toEqual('My third wallet');
      expect(wallet3.icon).toEqual(wallet.icon);
      const wallet4 = await keyRing.createPrincipal({
        icon: ':crying:',
      }); // TODO: TS does not like emojis, but they are unicode strings
      expect(wallet4.name).toEqual(wallet.name);
      expect(wallet4.icon).toEqual(':crying:');
    });
    it('should change the wallets name correctly', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      await keyRing.editPrincipal('0', { name: 'New name1' });
      await keyRing.editPrincipal('1', { name: 'New name2' });
      await keyRing.editPrincipal('2', { name: 'New name3' });

      const { wallets } = await keyRing.getState();
      expect(wallets[0].name).toEqual('New name1');
      expect(wallets[1].name).toEqual('New name2');
      expect(wallets[2].name).toEqual('New name3');
    });
    it('should fail to change an invalid wallet', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await expect(() =>
        keyRing.editPrincipal('10', { name: 'New name', emoji: 'test' })
      ).rejects.toEqual(Error(ERRORS.INVALID_WALLET_NUMBER));
      await expect(() =>
        keyRing.editPrincipal('-1', { name: 'New name', emoji: 'test' })
      ).rejects.toEqual(Error(ERRORS.INVALID_WALLET_NUMBER));
      await expect(() =>
        keyRing.editPrincipal('1.231', { name: 'New name', emoji: 'test' })
      ).rejects.toEqual(Error(ERRORS.INVALID_WALLET_NUMBER));
    });
    it('should change the wallet icon correctly', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      await keyRing.editPrincipal('0', { emoji: '123' });
      await keyRing.editPrincipal('1', { emoji: 'New emoji2' });
      await keyRing.editPrincipal('2', { emoji: 'New name3' });

      const { wallets } = await keyRing.getState();
      expect(wallets[0].icon).toEqual('123');
      expect(wallets[1].icon).toEqual('New emoji2');
      expect(wallets[2].icon).toEqual('New name3');
    });
    // Skipped since color is breaking it
    it('should register a token correctly to different subaccounts', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await keyRing.createPrincipal();
      await keyRing.createPrincipal();
      await keyRing.registerToken({
        canisterId: '5ymop-yyaaa-aaaah-qaa4q-cai',
        standard: 'xtc',
        subaccount: '1',
      }); // register WTC to other subaccounts
      await keyRing.registerToken({
        canisterId: '5ymop-yyaaa-aaaah-qaa4q-cai',
        standard: 'xtc',
        subaccount: '2',
      }); // register WTC
      await keyRing.registerToken({
        canisterId: '5ymop-yyaaa-aaaah-qaa4q-cai',
        standard: 'xtc',
        subaccount: '2',
      }); // register WTC twice
    });
    test('should fail to register an invalid canister id', async () => {
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      await expect(() =>
        keyRing.registerToken({ canisterId: 'test', standard: 'xtc' })
      ).rejects.toEqual(new Error(ERRORS.INVALID_CANISTER_ID));
      await expect(() =>
        keyRing.registerToken({
          canisterId:
            'ogkan-uvha2-mbm2l-isqcz-odcvg-szdx6-qj5tg-ydzjf-qrwe2-lbzwp-7qe',
          standard: 'xtc',
        })
      ).rejects.toEqual(new Error(ERRORS.INVALID_CANISTER_ID));
    });
  });

  describe('get balance', () => {
    const balances = {
      0: [
        {
          amount: '1000',
          token: {
            canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
            decimals: 8,
            name: 'ICP',
            standard: 'ICP',
            symbol: 'ICP',
          },
        },
        {
          amount: '1000',
          token: {
            canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
            decimals: 12,
            name: 'Cycles',
            standard: 'XTC',
            symbol: 'XTC',
          },
        },
        {
          amount: '1000',
          token: {
            canisterId: 'utozz-siaaa-aaaam-qaaxq-cai',
            decimals: 8,
            name: 'Wrapped ICP',
            standard: 'WICP',
            symbol: 'WICP',
          },
        },
      ],
    };
    let walletsCreated = 0;

    const mockgetBalances = async wallet => {
      const randomBalance = BigInt(0);
      balances[wallet.walletNumber] = randomBalance;
      await jest
        .spyOn(wallet, 'getBalances')
        .mockReturnValue(Promise.resolve(randomBalance));
    };

    beforeEach(async () => {
      keyRing = new PlugKeyRing(store);
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      walletsCreated = await createManyWallets(keyRing, mockgetBalances);
    });

    test('get default balance', async () => {
      expect(await keyRing.getBalances()).toMatchObject(balances[0]);
    });

    test('get specific balance', async () => {
      let ind = Math.round(Math.random() * (walletsCreated - 1));
      if (ind === 0) ind += 1;

      expect(await keyRing.getBalances({ subaccount: 'ind' })).toBe(
        balances[ind]
      );
    });

    test('get error with invalid wallet numbers', async () => {
      await expect(keyRing.getBalances({ subaccount: '-2' })).rejects.toThrow(
        ERRORS.INVALID_WALLET_NUMBER
      );
      await expect(
        keyRing.getBalances({ subaccount: 'walletsCreated + 2' })
      ).rejects.toThrow(ERRORS.INVALID_WALLET_NUMBER);
    });
  });

  describe('get transactions', () => {
    const transactions = {};
    let walletsCreated = 0;

    const mockGetTransaction = wallet => {
      const randomTransactions = createManyTransactions();
      transactions[wallet.walletNumber] = randomTransactions;
      jest.spyOn(wallet, 'getTransactions').mockImplementation(
        jest.fn(() => {
          return Promise.resolve(randomTransactions);
        })
      );
    };

    beforeEach(async () => {
      keyRing = new PlugKeyRing(store);
      const { wallet } = await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      mockGetTransaction(wallet);
      walletsCreated = await createManyWallets(keyRing, mockGetTransaction);
    });

    test('get specific transactions', async () => {
      const ind = Math.round(Math.random() * (walletsCreated - 1));

      expect(await keyRing.getTransactions({ subaccount: 'ind' })).toBe(
        transactions[ind]
      );
    });

    test('get error with invalid wallet numbers', async () => {
      await expect(
        keyRing.getTransactions({ subaccount: '-2' })
      ).rejects.toThrow(ERRORS.INVALID_WALLET_NUMBER);
      await expect(
        keyRing.getTransactions({ subaccount: 'walletsCreated + 2' })
      ).rejects.toThrow(ERRORS.INVALID_WALLET_NUMBER);
    });
  });

  describe('sendICP', () => {
    let walletsCreated = 0;
    beforeEach(async () => {
      keyRing = new PlugKeyRing(store);
      await keyRing.create({ password: TEST_PASSWORD });
      await keyRing.unlock(TEST_PASSWORD);
      walletsCreated = await createManyWallets(keyRing);
    });

    it('call create agent with secret key', async () => {
      const { wallets } = await keyRing.getState();
      const amount = BigInt(0);
      const ind = Math.round(Math.random() * (walletsCreated - 1));
      const to = wallets[ind].principal;

      await keyRing.send({
        to: to.toString(),
        amount: amount.toString(),
        canisterId: TOKENS.ICP.canisterId,
      });
      expect(createAgent).toHaveBeenCalled();
    });
    it('call sendICP with to account', async () => {
      const { wallets } = await keyRing.getState();
      const amount = BigInt(0);
      const ind = Math.round(Math.random() * (walletsCreated - 1));
      const to = getAccountId(Principal.fromText(wallets[ind].principal));

      await keyRing.send({
        to: to.toString(),
        amount: amount.toString(),
        canisterId: TOKENS.ICP.canisterId,
      });
      expect(createAgent).toHaveBeenCalled();
      expect(mockedSendToken.mock.calls[0][0].amount).toEqual(amount);
      expect(mockedSendToken.mock.calls[0][0].to).toEqual(to);
    });

    describe('nfts', () => {
      beforeEach(async () => {
        keyRing = new PlugKeyRing(store);
        await keyRing.create({
          password: TEST_PASSWORD,
        });
        await keyRing.unlock(TEST_PASSWORD);
      });
      it('should fetch NFTs correctly', async () => {
        const nfts = await keyRing.getNFTs();
        expect(nfts).toEqual([mockdeNFTCollection]);
      });
      it('should fail to fetch NFTs on inexistant account', async () => {
        await expect(keyRing.getNFTs({ subaccount: '1' })).rejects.toThrow(
          ERRORS.INVALID_WALLET_NUMBER
        );
      });
      it('should transfer an NFT correctly', async () => {
        const nfts = (await keyRing.getNFTs()) || [];
        const { tokens } = nfts[0];
        const to =
          'ogkan-uvha2-mbm2l-isqcz-odcvg-szdx6-qj5tg-ydzjf-qrwe2-lbzwp-7qe';
        const transferred = await keyRing.transferNFT({
          token: tokens[0] as NFTDetails<bigint>,
          to,
          standard: tokens[0].standard,
        });
        expect(transferred).toMatchObject([]);
        expect(mockedTransferNFT).toHaveBeenCalled();
        expect(mockedTransferNFT.mock.calls[0][0].toString()).toEqual(to);
        expect(mockedTransferNFT.mock.calls[0][1].toString()).toEqual(
          tokens[0].index.toString()
        );
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
