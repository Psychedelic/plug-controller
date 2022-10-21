import { lebDecode } from '../../crypto/binary';
import { InferredTransaction } from '../../../interfaces/transactions';
import { parsePrincipal, recursiveParseBigint } from '../../object';

import { buildSonicData } from '../../dfx/history/cap/sonic';

const parseUnderscoreNumber = value =>
  value ? Number(value.replace('_', '')) : null;

export const formatCapTransaction = async (
  event,
  canistersInfo
): Promise<InferredTransaction> => {
  const { canisterId } = event;
  const prettifyEvent = event.prettyEvent;
  if (canisterId) {
    prettifyEvent.details = {
      ...prettifyEvent.details,
      canisterInfo: canistersInfo[canisterId],
    };
  }
  const { details, operation, time, caller } = prettifyEvent || {};
  const { amount, token, token_id, token_identifier } = details || {};
  const parsedAmount =
    amount instanceof Array && !amount.some(value => typeof value !== 'number')
      ? lebDecode(Uint8Array.from(amount as Array<number>))
      : amount;
  const tokenId =
    details?.tokenId ||
    token ||
    token_id ||
    parseUnderscoreNumber(token_identifier) ||
    '';
  const formattedTransaction = {
    hash: event.sk,
    timestamp: time,
    type: operation,
    details: {
      ...details,
      amount: parsedAmount,
      canisterId,
      tokenId,
      to: parsePrincipal(details?.to),
      from: parsePrincipal(details?.from),
      sonicData: await buildSonicData({
        canisterId,
        details,
        operation,
        canistersInfo,
        tokenId,
      }),
      // mkpData: await buildMKPData(),
    },
    caller: parsePrincipal(caller) || '',
  };

  return recursiveParseBigint(formattedTransaction);
};