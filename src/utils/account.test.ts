import { AccountCredentials } from "../interfaces/account";
import { createAccount, createAccountFromMnemonic } from "./account";

describe('Account utils', () => {
    let globalAccount: AccountCredentials;
    const MAX_ACCOUNTS = 5;

    beforeAll(() => {
        globalAccount = createAccount();
    });
    beforeEach(() => {});
  
    it('should create a new account with mnemonic, secret and public keys', async () => {
      const account = createAccount();
  
      expect(account).toHaveProperty('mnemonic');
      expect(account).toHaveProperty('secretKey');
      expect(account).toHaveProperty('publicKey');
    });

    it('should create a new account from a mnemonic, having new secret and public keys', async () => {
        const account = createAccountFromMnemonic(globalAccount.mnemonic, 1);
    
        expect(account).toHaveProperty('mnemonic');
        expect(account).toHaveProperty('secretKey');
        expect(account).toHaveProperty('publicKey');

        const { mnemonic, secretKey, publicKey } = account;
        expect(mnemonic).toEqual(globalAccount.mnemonic);
        expect(secretKey).not.toEqual(globalAccount.secretKey);
        expect(publicKey).not.toEqual(globalAccount.publicKey);
      });

    it('should always derive the same account given the same mnemonic and account ID', async () => {
        for(let i = 1; i < MAX_ACCOUNTS; i++) {
            const account = createAccountFromMnemonic(globalAccount.mnemonic, i);
            const newAccount = createAccountFromMnemonic(globalAccount.mnemonic, i);
        
            expect(account.mnemonic).toEqual(newAccount.mnemonic);
            expect(account.secretKey).toEqual(newAccount.secretKey);
            expect(account.publicKey).toEqual(newAccount.publicKey);

        }
    });
  });
  