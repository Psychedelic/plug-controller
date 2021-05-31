import { ERRORS } from "../../constants";
import { AccountCredentials } from "../../interfaces/account";
import { open, sign } from "../signature";
import { createAccount, createAccountFromMnemonic } from "./index";

describe('Account utils', () => {
    let globalAccount: AccountCredentials;
    const MAX_ACCOUNTS = 5;

    beforeAll(() => {
        globalAccount = createAccount();
    });

    describe('credentials creation', () => {
        it('should create a new account with mnemonic, secret and public keys', () => {
        const account = createAccount();
    
        expect(account).toHaveProperty('mnemonic');
        expect(account).toHaveProperty('secretKey');
        expect(account).toHaveProperty('publicKey');
        });
    
        it('should always create different new accounts', () => {
            const mnemonics: string[] = [];
            const secretKeys: string[] = [];
            const publicKeys: string[] = [];
            for(let i = 1; i < MAX_ACCOUNTS; i++) {
                const { mnemonic, secretKey, publicKey } = createAccount();
                expect(mnemonics).not.toContain(mnemonic);
                expect(secretKeys).not.toContain(secretKey);
                expect(publicKeys).not.toContain(publicKey);

                mnemonics.push(mnemonic);
                secretKeys.push(secretKey.hex);
                publicKeys.push(publicKey.hex);
                
            }
        });

        it('should create a new account from a mnemonic, having new secret and public keys', () => {
            const account = createAccountFromMnemonic(globalAccount.mnemonic, 1);
        
            expect(account).toHaveProperty('mnemonic');
            expect(account).toHaveProperty('secretKey');
            expect(account).toHaveProperty('publicKey');
    
            const { mnemonic, secretKey, publicKey } = account;
            expect(mnemonic).toEqual(globalAccount.mnemonic);
            expect(secretKey).not.toEqual(globalAccount.secretKey);
            expect(publicKey).not.toEqual(globalAccount.publicKey);
        });
    
        it('should always derive the same account given the same mnemonic and account ID', () => {
            for(let i = 1; i < MAX_ACCOUNTS; i++) {
                const account = createAccountFromMnemonic(globalAccount.mnemonic, i);
                const newAccount = createAccountFromMnemonic(globalAccount.mnemonic, i);
            
                expect(account.mnemonic).toEqual(newAccount.mnemonic);
                expect(account.secretKey).toEqual(newAccount.secretKey);
                expect(account.publicKey).toEqual(newAccount.publicKey);
            }
        });

        it('should fail if provided an invalid mnemonic', () => {
            const invalidMnemonic = 'Some invalid Mnemonic'
            expect(() => createAccountFromMnemonic(invalidMnemonic, 1)).toThrow(ERRORS.INVALID_MNEMONIC);
        });

        it('should fail if provided an invalid account id', () => {
            const stringId = '1';
            const negativeId = -1;
            expect(() => createAccountFromMnemonic(globalAccount.mnemonic, stringId as any)).toThrow(ERRORS.INVALID_ACC_ID);
            expect(() => createAccountFromMnemonic(globalAccount.mnemonic, negativeId)).toThrow(ERRORS.INVALID_ACC_ID);
        });

        // This checks that this works on .js files as well as TS which auto-checks these things
        it('should fail if provided an empty mnemonic', () => {
            expect(() => createAccountFromMnemonic('', 1)).toThrow(ERRORS.INVALID_MNEMONIC);
            expect(() => createAccountFromMnemonic(undefined as any, 1)).toThrow(ERRORS.INVALID_MNEMONIC);
            expect(() => createAccountFromMnemonic(null as any, 1)).toThrow(ERRORS.INVALID_MNEMONIC);
        });
    })
  
    describe('credentials utility', () => {
        it('should sign a message into an unreadable state and recover it using its keys', () => {
            const { secretKey, publicKey } = globalAccount;
            const message = 'This is a secret message!';
            const signed = sign(message, secretKey);
            const opened = open(signed, publicKey);
            expect(opened).toEqual(message);
        });
    });
    
  });
  