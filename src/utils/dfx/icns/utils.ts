import { InferredTransaction } from '../../../interfaces/transactions';
import { PRINCIPAL_REGEX } from '../constants';

interface ICNSMapping { [key: string]: string | undefined }

export const getMappingValue = (pid: string, mappings: ICNSMapping) => ({ principal: pid, icns: mappings[pid] });

export const replacePrincipalsForICNS = (tx: InferredTransaction, mappings: ICNSMapping): InferredTransaction => {
  const parsedTx = { ...tx };
  const { from, to } = parsedTx?.details || {};
  parsedTx.details = {
    ...parsedTx.details,
    from: getMappingValue(from, mappings),
    to: getMappingValue(to, mappings),
  };
  return parsedTx;
}

export const recursiveFindPrincipals = (transactions: InferredTransaction[]): string[] => {
  return transactions.reduce((acc, tx) => {
    const copy: string[] = [...acc];
    const { from, to } = tx.details || {};
    if (PRINCIPAL_REGEX.test(from)) copy.push(from);
    if (PRINCIPAL_REGEX.test(to)) copy.push(to);
    return [...new Set(copy)];
  }, []);
}