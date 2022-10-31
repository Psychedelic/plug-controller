import { PlugWalletArgs } from '../interfaces/plug_wallet';
import PlugWallet from './base';
import { IDENTITY_TYPES } from '../utils/account/constants';
import { SignIdentity } from '@dfinity/agent';
import PlugLedgerWallet from './ledger';

export const createWallet = (
  walletArgs: PlugWalletArgs & { identity: SignIdentity }
) => {
  switch (walletArgs.type) {
    case IDENTITY_TYPES.mnemonic:
    case IDENTITY_TYPES.pem256k1:
    case IDENTITY_TYPES.pem25519:
      return new PlugWallet(walletArgs);
    case IDENTITY_TYPES.ledgerUSB:
    case IDENTITY_TYPES.ledgerUSBRN:
    case IDENTITY_TYPES.ledgerBLERN:
      return new PlugLedgerWallet(walletArgs);
    default:
      throw new Error('Invalid wallet type');
  }
};
