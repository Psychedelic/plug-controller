import { FormattedTransactions, FormattedTransaction } from '../../../interfaces/transactions';

export const ACTIVITY_STATUS = {
  COMPLETED: 0,
  PENDING: 1,
  REVERTED: 2,
};

export const TOKENS = {
  ICP: {
    symbol: 'ICP',
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    name: 'ICP',
    decimals: 8,
    amount: 0,
    value: 0,
    standard: 'ROSETTA',
  },
  XTC: {
    symbol: 'XTC',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Cycles',
    decimals: 12,
    amount: 0,
    value: 0,
    standard: 'DIP20',
  },
  WICP: {
    symbol: 'WICP',
    canisterId: 'aanaa-xaaaa-aaaah-aaeiq-cai',
    name: 'Wrapped ICP',
    decimals: 8,
    amount: 0,
    value: 0,
    standard: 'DIP20',
  },
};


export const AMOUNT_ERROR = 'Error';
export const USD_PER_TC = 1.42656;
export const E8S_PER_ICP = 100_000_000;

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

const parseAmount = (transactionObject) => {
  const {
    amount, currency, token, sonicData,
  } = transactionObject;

  const { decimals = TOKENS[sonicData?.token?.details?.symbol]?.decimals } = { ...currency, ...token, ...(sonicData?.token ?? {}) };
  // TODO: Decimals are currently not in DAB. Remove once they are added.

  const parsedAmount = parseToFloatAmount(amount, decimals);

  return parsedAmount;
};

const parseFee = (fee) => {

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

export const formatTransaction = (transaction, principalId, accountId, network, icpPrice): FormattedTransaction  => {
    const {
      details, hash, canisterInfo, caller, timestamp,
    } = transaction || {};
    const { sonicData, fee } = details || {};
    const amount = parseAmount(details);
    const getSymbol = () => {
      if ('tokenRegistryInfo' in (details?.canisterInfo || [])) return details?.canisterInfo.tokenRegistryInfo.symbol;
      if ('nftRegistryInfo' in (details?.canisterInfo || [])) return 'NFT';
      return details?.currency?.symbol ?? sonicData?.token?.details?.symbol ?? '';
    };
    
    const isOwnTx = [principalId, accountId].includes(transaction?.caller);
    const getType = () => {
      const { type } = transaction;
      if (type.toUpperCase() === 'TRANSFER') {
        return isOwnTx ? 'SEND' : 'RECEIVE';
      }
      if (type.toUpperCase() === 'LIQUIDITY') {
        return `${type.includes('removeLiquidity') ? 'Remove' : 'Add'} Liquidity`;
      }
      return type.toUpperCase();
    };

    const asset = formatAssetBySymbol(
      amount,
      getSymbol(),
      icpPrice,
    );

    const trx = {
      ...asset,
      type: getType(),
      hash,
      to: details?.to?.icns ?? details?.to?.principal,
      from: (details?.from?.icns ?? details?.from?.principal) || caller,
      date: timestamp,
      status: ACTIVITY_STATUS[details?.status],
      logo: details?.sonicData?.token?.logo || details?.canisterInfo?.icon || '',
      symbol: getSymbol(),
      canisterId: details?.canisterId || details?.canisterInfo?.canisterId,
      canisterInfo: canisterInfo || details?.canisterInfo,
      details: { 
        ...details,
        amount,
        fee: parseFee(details.fee),
        caller,
        token:
        details?.canisterId && network.tokens.find((token) => token.canisterId === details.canisterId), 
      },
    };
    return trx;
  
};


export const formatTransactions = (transactions, principalId, accountId, network, icpPrice): FormattedTransactions => {
  
  const parsedTrx = transactions?.map((trx) => formatTransaction(trx,principalId,accountId,network,icpPrice)) || [];

  const sortedTransactions = {
    total: parsedTrx.length,
    transactions: parsedTrx.sort((a, b) =>
      b.date - a.date < 0 ? -1 : 1
    ),
  };

  return sortedTransactions;
};
