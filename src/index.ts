import PlugKeyRing from './PlugKeyRing';
import { getAccountId } from './utils/account';
import { getCanisterInfo, getMultipleCanisterInfo } from './utils/dab';
import { decode, encode } from './utils/idl';

export default {
  PlugKeyRing,
  getAccountId,
  getCanisterInfo,
  getMultipleCanisterInfo,
  IDLDecode: decode,
  IDLEncode: encode,
};
