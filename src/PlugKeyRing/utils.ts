import { ERRORS } from '../errors';

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
