/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { ActorSubclass } from '@dfinity/agent';

import NNSService, {
  GetTransactionsResponse,
} from '../../../interfaces/nns_uid';
import { OldMethodsExtendedActor } from '../actorFactory';

type OldNNSService = OldMethodsExtendedActor<NNSService>
export interface NNSServiceExtended extends OldNNSService {
  getTransactions: (accountId: string) => Promise<GetTransactionsResponse>;
}

const getTransactions = (
  actor: ActorSubclass<OldNNSService>,
  accountId: string
): Promise<GetTransactionsResponse> => {
  return actor._get_transactions({
    account_identifier: accountId,
    page_size: 20,
    offset: 0,
  });
};

export default { getTransactions };
