import { Principal } from '@dfinity/agent';
import { ERRORS } from '../errors';
import { PRINCIPAL_REGEX, CANISTER_MAX_LENGTH } from '../utils/dfx/constants';

// eslint-disable-next-line
export const validateSubaccount = (
  subaccount: number,
  walletCount: number
) => {
  if (
    subaccount < 0 ||
    !Number.isInteger(subaccount) ||
    subaccount >= walletCount
  ) {
    throw new Error(ERRORS.INVALID_WALLET_NUMBER);
  }
};

export const validatePrincipalId = (text: string): boolean => {
  try {
    return Boolean(PRINCIPAL_REGEX.test(text) && Principal.fromText(text));
  } catch (e) {
    return false;
  }
};

export const validateCanisterId = (text: string): boolean => {
  try {
    return Boolean(
      text.length <= CANISTER_MAX_LENGTH && Principal.fromText(text)
    );
  } catch (e) {
    return false;
  }
};
