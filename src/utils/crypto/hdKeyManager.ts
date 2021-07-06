import tweetnacl from 'tweetnacl';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

import { DERIVATION_PATH } from '../account/constants';

export const createKeyPair = (
  mnemonic: string,
  index = 0
): tweetnacl.SignKeyPair => {
  const seed = bip39.mnemonicToSeedSync(mnemonic); // root keyPair seed
  const { key } = derivePath(DERIVATION_PATH, seed.toString('hex'), index);
  return tweetnacl.sign.keyPair.fromSeed(key);
};

export default {};
