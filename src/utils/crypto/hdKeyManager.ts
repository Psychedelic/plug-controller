import tweetnacl from 'tweetnacl';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import HDKey from 'hdkey';

import { DERIVATION_PATH } from '../account/constants';

export const createKeyPair = (
  mnemonic: string,
  index = 0
): tweetnacl.SignKeyPair => {
  // Generate bip39 mnemonic. [Curve agnostic]
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Derive key using dfinity's path
  const { key } = derivePath(DERIVATION_PATH, seed.toString('hex'), index);
  return tweetnacl.sign.keyPair.fromSeed(key);
};

export const createSecp256K1KeyPair = (mnemonic: string, index = 0) => {
  // Generate bip39 mnemonic. [Curve agnostic]
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const masterKey = HDKey.fromMasterSeed(seed);

  // BIP 44 derivation path definition
  // m / purpose' / coin_type' / account' / change / address_index ---> this being the subaccount index
  const derivedKey = masterKey.derive(`${DERIVATION_PATH}/${index}`);
  // Key is serialized as { xpriv: string, xpub: string }
  return derivedKey.toJSON();
};
