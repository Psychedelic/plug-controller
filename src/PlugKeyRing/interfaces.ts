import PlugWallet from "../PlugWallet";
import { ERROR_CODES }  from "../errors"

export interface CreateImportResponse { wallet: PlugWallet; mnemonic: string; }

export interface CreatePrincipalOptions {
  name?: string;
  icon?: string;
}

export interface CreateOptions extends CreatePrincipalOptions {
  password: string;
  entropy?: Buffer;
}

export interface CreateAndPersistKeyRingOptions extends CreateOptions {
  mnemonic: string;
}

export interface ImportMnemonicOptions {
  mnemonic: string;
  password: string;
}

export interface ImportFromPemOptions extends CreatePrincipalOptions {
  pem: string;
}

export interface ImportFromSecretKey extends CreatePrincipalOptions {
  secretKey: string;
}

export interface GetPrincipalFromPem {
  pem: string;
}

export interface ValidatePemResponse {
  isValid: boolean;
  errorType?: string;
}
