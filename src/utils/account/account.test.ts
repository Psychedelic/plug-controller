import { Principal } from '@dfinity/principal';
import { ERRORS } from '../../errors';
import { AccountCredentials } from '../../interfaces/account';
import { Secp256k1KeyPair } from '../crypto/keys';
import { verify, sign } from '../signature';
import {
  createAccount,
  createAccountFromMnemonic,
  getAccountId,
} from './index';

describe('Account utils', () => {
  let globalAccount: AccountCredentials;
  let globalKeys: Secp256k1KeyPair;
  const MAX_ACCOUNTS = 5;

  beforeAll(() => {
    globalAccount = createAccount();
    globalKeys = globalAccount.identity.getKeyPair();
  });

  describe('credentials creation', () => {
    it('should create a new account with mnemonic, secret and public keys', () => {
      const account = createAccount();

      expect(account).toHaveProperty('mnemonic');
      expect(account).toHaveProperty('identity');
      expect(account).toHaveProperty('accountId');
      expect(account.identity.getKeyPair()).toHaveProperty('secretKey');
      expect(account.identity.getKeyPair()).toHaveProperty('publicKey');
    });

    it('should always create different new accounts', () => {
      const mnemonics: string[] = [];
      const secretKeys: string[] = [];
      const publicKeys: string[] = [];
      for (let i = 1; i < MAX_ACCOUNTS; i += 1) {
        const { mnemonic, identity } = createAccount();
        const { publicKey, secretKey } = identity.getKeyPair();
        expect(mnemonics).not.toContain(mnemonic);
        expect(secretKeys).not.toContain(secretKey);
        expect(publicKeys).not.toContain(publicKey);

        mnemonics.push(mnemonic);
        secretKeys.push(secretKey.toString());
        publicKeys.push(publicKey.toString());
      }
    });

    it('should create a new account from a mnemonic, having new secret and public keys', () => {
      const account = createAccountFromMnemonic(globalAccount.mnemonic, 1);

      expect(account).toHaveProperty('mnemonic');
      expect(account).toHaveProperty('identity');
      expect(account).toHaveProperty('accountId');

      expect(account.identity.getKeyPair()).toHaveProperty('secretKey');
      expect(account.identity.getKeyPair()).toHaveProperty('publicKey');

      const { mnemonic, identity, accountId } = account;
      const { publicKey, secretKey } = identity.getKeyPair();

      // Mnemonic should be the same but keys and accountId shouldn't
      expect(mnemonic).toEqual(globalAccount.mnemonic);
      expect(accountId).not.toEqual(globalAccount.accountId);
      expect(secretKey).not.toEqual(globalKeys.secretKey.toString());
      expect(publicKey).not.toEqual(globalKeys.publicKey.toDer().toString());
    });

    it('should always derive the same account given the same mnemonic and account ID', () => {
      for (let i = 0; i < MAX_ACCOUNTS; i += 1) {
        const account = createAccountFromMnemonic(globalAccount.mnemonic, i);
        const newAccount = createAccountFromMnemonic(globalAccount.mnemonic, i);
        const { secretKey, publicKey } = account.identity.getKeyPair();
        const {
          secretKey: newSecret,
          publicKey: newPublic,
        } = newAccount.identity.getKeyPair();

        expect(account.mnemonic).toEqual(newAccount.mnemonic);
        expect(account.accountId).toEqual(newAccount.accountId);
        expect(secretKey).toEqual(newSecret);
        expect(publicKey).toEqual(newPublic);
      }
    });

    // Commented until we get ahold on keysmith engineers
    xit('should generate the correct principal id', () => {
      const mnemonic =
        'easily drift crazy brother trash green cricket peasant unhappy fruit behind pudding';
      const principal =
        'gkuhp-3onv2-yuitx-msib3-z4kyb-uw5ua-fehux-6ontl-47u47-iwuul-rae';
      const { identity } = createAccountFromMnemonic(mnemonic, 0);
      expect(identity.getPrincipal().toText()).toEqual(principal);
    });

    it('should fail if provided an invalid mnemonic', () => {
      const invalidMnemonic = 'Some invalid Mnemonic';
      expect(() => createAccountFromMnemonic(invalidMnemonic, 1)).toThrow(
        ERRORS.INVALID_MNEMONIC
      );
    });

    it('should fail if provided an invalid account id', () => {
      const stringId = '1';
      const negativeId = -1;
      expect(() =>
        createAccountFromMnemonic(globalAccount.mnemonic, stringId as any)
      ).toThrow(ERRORS.INVALID_ACC_ID);
      expect(() =>
        createAccountFromMnemonic(globalAccount.mnemonic, negativeId)
      ).toThrow(ERRORS.INVALID_ACC_ID);
    });

    // This checks that this works on .js files as well as TS which auto-checks these things
    it('should fail if provided an empty mnemonic', () => {
      expect(() => createAccountFromMnemonic('', 1)).toThrow(
        ERRORS.INVALID_MNEMONIC
      );
      expect(() => createAccountFromMnemonic(undefined as any, 1)).toThrow(
        ERRORS.INVALID_MNEMONIC
      );
      expect(() => createAccountFromMnemonic(null as any, 1)).toThrow(
        ERRORS.INVALID_MNEMONIC
      );
    });
  });

  describe('id generation', () => {
    it('should generate the correct account id', () => {
      const principal = Principal.fromText(
        'gkuhp-3onv2-yuitx-msib3-z4kyb-uw5ua-fehux-6ontl-47u47-iwuul-rae'
      );
      const accountId =
        '1f77688a6a9b2b85640d753d487209344cc9c9675c409bbef5e061710c7220ab';
      const id = getAccountId(principal);
      expect(id).toEqual(accountId);
    });
  });

  describe('credentials utility', () => {
    test('should sign a message into an unreadable state and recover it using its keys', () => {
      const { secretKey, publicKey } = globalKeys;
      const message = 'This is a secret message!';
      const signed = sign(message, secretKey);
      const opened = verify(message, signed, publicKey);
      expect(opened).toBe(true);
    });
  });
});
