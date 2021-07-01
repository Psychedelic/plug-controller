import fetch from 'cross-fetch';

import { getTransactions } from './rosetta';
import {
  mockRosettaTransaction,
  mockTransactionResult,
  mockAccountID,
} from './mockData';

jest.mock('cross-fetch', () =>
  jest.fn().mockImplementation(() => mockRosettaTransaction)
);

describe('DFX Utils', () => {
  describe('rosetta', () => {
    describe('getTransactions', () => {
      it('get correct info', async () => {
        expect(await getTransactions(mockAccountID)).toMatchObject(
          mockTransactionResult
        );
      });
    });
  });
});
