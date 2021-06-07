import bip39  = require('bip39');

import PlugKeyRing from ".";
import PlugWallet from "../PlugWallet";
import StorageMock from "../utils/storage/mock";

const TEST_PASSWORD = 'Somepassword1234';
const TEST_MNEMONIC = bip39.generateMnemonic();

describe('Plug KeyRing', () => {
    const store = new StorageMock();
    const testWallet = new PlugWallet({ name: 'test', mnemonic: TEST_MNEMONIC, password: 'asd', walletNumber: 0 });
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
            expect(() => keyRing.unlock(TEST_PASSWORD)).toThrow('Plug must be initialized');
            expect(() => keyRing.setCurrentPrincipal(testWallet)).toThrow('Plug must be initialized');
            expect(() => keyRing.setCurrentPrincipal(testWallet)).toThrow('Plug must be initialized');
            await expect(() => keyRing.createPrincipal()).rejects.toEqual(Error('Plug must be initialized'));
            await expect(() => keyRing.getState()).rejects.toEqual(Error('The state is locked'));
        });
    })

    describe('creation', () => {
        it('should create a new keyring and be locked by default', async () => {
            await keyRing.create({ password: TEST_PASSWORD });
            await expect(() => keyRing.getState()).rejects.toEqual(Error('The state is locked'));
        });
        it('should create a new keyring and expose state correctly', async () => {
            const wallet = await keyRing.create({ password: TEST_PASSWORD });
            expect(keyRing.unlock(TEST_PASSWORD)).toEqual(true);

            const state = await keyRing.getState();
            expect(state.wallets.length).toEqual(1);
            expect(state.wallets[0]).toEqual(wallet);
            expect(state.currentWalletId).toEqual(0);
            expect(state.password).toEqual(TEST_PASSWORD);  // Should I expose this? 
            expect(bip39.validateMnemonic(state.mnemonic)).toEqual(true);
        });
        it('should fail if not password was provided', async () => {
            await expect(() => keyRing.create({ password: '' })).rejects.toEqual(Error('A password is required'));
        });
    });

    describe('import', () => {
        it('should import a keyring and be locked by default', async () => {
            await keyRing.importMnemonic({ password: TEST_PASSWORD, mnemonic: TEST_MNEMONIC });
            await expect(() => keyRing.getState()).rejects.toEqual(Error('The state is locked'));
        });
        it('should import a keyring and expose state correctly', async () => {
            const wallet = await keyRing.importMnemonic({ password: TEST_PASSWORD, mnemonic: TEST_MNEMONIC });
            expect(keyRing.unlock(TEST_PASSWORD)).toEqual(true);

            const state = await keyRing.getState();
            expect(state.wallets.length).toEqual(1);
            expect(state.wallets[0]).toEqual(wallet);
            expect(state.currentWalletId).toEqual(0);
            expect(state.mnemonic).toEqual(TEST_MNEMONIC); 
            expect(state.password).toEqual(TEST_PASSWORD);  // Should I expose this? 
            expect(bip39.validateMnemonic(state.mnemonic)).toEqual(true);
        });
        it('should fail if not password or mnemonic were provided', async () => {
            await expect(() => keyRing.importMnemonic({ password: '', mnemonic: TEST_MNEMONIC })).rejects.toEqual(Error('A password is required'));
            await expect(() => keyRing.importMnemonic({ password: TEST_PASSWORD, mnemonic: '' })).rejects.toEqual(Error('The provided mnemonic is invalid'));
        });
        it('should fail if the mnemonic is invalid', async () => {
            await expect(() => keyRing.importMnemonic({ password: TEST_PASSWORD, mnemonic: 'some test mnemonic' })).rejects.toEqual(Error('The provided mnemonic is invalid'));
        });
    });
  });
  