import { AccountCredentials } from "../interfaces/account";
import { createAccount, createAccountFromMnemonic } from "./account";

describe('Account utils', () => {
    let globalAccount: AccountCredentials;
    const MAX_ACCOUNTS = 5;

    beforeAll(() => {
        globalAccount = createAccount();
    });

    // Creacion
    // Usabilidad (firma, verificacion)

    describe('credentials creation', () => {
        it('should create a new account with mnemonic, secret and public keys', async () => {
        const account = createAccount();
    
        expect(account).toHaveProperty('mnemonic');
        expect(account).toHaveProperty('secretKey');
        expect(account).toHaveProperty('publicKey');
        });
    
        it('should always create different new accounts', async () => {
            const mnemonics: string[] = [];
            const secretKeys: Uint8Array[] = [];
            const publicKeys: Uint8Array[] = [];
            for(let i = 1; i < MAX_ACCOUNTS; i++) {
                const { mnemonic, secretKey, publicKey } = createAccount();
                expect(mnemonics).not.toContain(mnemonic);
                expect(secretKeys).not.toContain(secretKey);
                expect(publicKeys).not.toContain(publicKey);

                mnemonics.push(mnemonic);
                secretKeys.push(secretKey);
                publicKeys.push(publicKey);
                
            }
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

        xit('should fail if provided an invalid mnemonic', async () => {
            const invalidMnemonic = 'Some invalid Mnemonic'
            expect(() => createAccountFromMnemonic(invalidMnemonic)).toThrow('The provided mnemonic is invalid');
        });

        xit('should fail if provided an invalid account id', async () => {
            const stringId = '1';
            const negativeId = -1;
            const nonIntegerId = 1.1;
            expect(() => createAccountFromMnemonic(globalAccount.mnemonic, stringId as any)).toThrow('The account ID should be a positive integer');
            expect(() => createAccountFromMnemonic(globalAccount.mnemonic, negativeId)).toThrow('The account ID should be a positive integer');
            expect(() => createAccountFromMnemonic(globalAccount.mnemonic, nonIntegerId)).toThrow('The account ID should be a positive integer');
        });

        // This checks that this works on .js files as well as TS which auto-checks these things
        xit('should fail if provided an empty mnemonic', async () => {
            expect(() => createAccountFromMnemonic('')).toThrow('No mnemonic was provided');
            expect(() => createAccountFromMnemonic(undefined as any)).toThrow('No mnemonic was provided');
            expect(() => createAccountFromMnemonic(null as any)).toThrow('No mnemonic was provided');
        });
    })
  
    
  });
  