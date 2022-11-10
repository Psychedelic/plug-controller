import { TOKENS, USD_PER_TC } from '../constants'

export const formatAssetBySymbol = (_amount, symbol, icpPrice) => {
  const amount = Number.isNaN(_amount) ? NaN : parseFloat(_amount);
  const icpValue = Number.isNaN(amount) ? NaN : amount * icpPrice;
  const tcValue = Number.isNaN(amount) ? NaN : amount * USD_PER_TC;

  return (
    {
      ICP: {
        amount,
        value: icpValue,
        symbol: 'ICP',
        decimals: 8,
      },
      XTC: {
        amount,
        value: tcValue,
        symbol: 'XTC',
        decimals: 12,
      },
      WTC: {
        amount,
        value: tcValue,
        symbol: 'WTC',
        decimals: 12,
      },
      WICP: {
        amount,
        value: icpValue,
        symbol: 'WICP',
        decimals: 8,
      },
      default: { amount },
    }[symbol || 'default'] || { amount }
  );
};

export const parseToFloatAmount = (amount, decimals) => {
  let amountString = `${amount}`;
  let prefix = '';

  if (amountString[0] === '-') {
    prefix = '-';
    amountString = amountString.slice(1, amountString.length);
  }

  const difference = decimals - amountString.length;

  if (decimals >= amountString.length) {
    const formatedString = '0'.repeat(difference + 1) + amountString;

    return `${prefix + formatedString[0]}.${formatedString.slice(1, formatedString.length)}`;
  }

  return `${prefix + amountString.slice(0, Math.abs(difference))}.${amountString.slice(Math.abs(difference))}`;
};

export const parseAmount = (transactionObject) => {
  const {
    amount, currency, token, sonicData,
  } = transactionObject;

  const { decimals = TOKENS[sonicData?.token?.details?.symbol]?.decimals } = { ...currency, ...token, ...(sonicData?.token ?? {}) };
  // TODO: Decimals are currently not in DAB. Remove once they are added.

  const parsedAmount = parseToFloatAmount(amount, decimals);

  return parsedAmount;
};

export const parseFee = (fee) => {

  if (fee instanceof Object && ('token' in fee || 'currency' in fee)) {
    return {
      ...fee,
      amount: parseAmount(fee),
    }
  }
  return {
    amount: fee,
  }
  
}