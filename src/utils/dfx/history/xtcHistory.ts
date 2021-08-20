import fetch from 'cross-fetch';

const KYASHU_URL = 'https://ikbsza5one.execute-api.us-west-2.amazonaws.com/dev';

export const getXTCTransactions = async (
  principalId: string,
  txnIds?: Array<bigint>
): Promise<any> => {
  const response = await fetch(
    `${KYASHU_URL}/txns/${principalId}${
      txnIds?.length ? `?txnIds=[${txnIds.join(',')}]` : ''
    }`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
      },
    }
  );
  console.log('xtc transactions', response.json());
};

export const requestCacheUpdate = async (
  principalId: string,
  txnIds?: Array<bigint>
): Promise<any> => {
  const response = await fetch(`${KYASHU_URL}/txn/${principalId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
    body: JSON.stringify({
      txnIds: txnIds?.map(tx => tx.toString()),
    }),
  });
  console.log('xtc update', response.json());
};
