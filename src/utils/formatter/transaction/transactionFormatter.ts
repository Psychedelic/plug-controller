import { FormattedTransactions, FormattedTransaction } from '../../../interfaces/transactions';

export const ACTIVITY_STATUS = {
  COMPLETED: 0,
  PENDING: 1,
  REVERTED: 2,
};

export const formatTransaction = (transaction, principalId, accountId, network): FormattedTransaction  => {
    const {
      details, hash, canisterInfo, caller, timestamp,
    } = transaction || {};
    const { sonicData } = details || {};
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

    const trx = {
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
        caller,
        token:
        details?.canisterId && network.tokens.find((token) => token.canisterId === details.canisterId), 
      },
    };
    return trx;
  
};


export const formatTransactions = (transactions, principalId, accountId, network): FormattedTransactions => {
  
  const parsedTrx = transactions?.map((trx) => formatTransaction(trx,principalId,accountId,network)) || [];

  const sortedTransactions = {
    total: parsedTrx.length,
    transactions: parsedTrx.sort((a, b) =>
      b.date - a.date < 0 ? -1 : 1
    ),
  };

  return sortedTransactions;
};
