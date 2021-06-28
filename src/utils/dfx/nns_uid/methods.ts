/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { ActorSubclass } from '@dfinity/agent';

import NNSService, {
  GetTransactionsResponse,
} from '../../../interfaces/nns_uid';

export interface NNSServiceExtended extends NNSService {
  getTransactions: (accountId: string) => Promise<GetTransactionsResponse>;
}

const getTransactions = (
  actor: ActorSubclass<NNSService>,
  accountId: string
): Promise<GetTransactionsResponse> => {
  return actor.get_transactions({
    account_identifier: accountId,
    page_size: 20,
    offset: 0,
  });
};

export default { getTransactions };
