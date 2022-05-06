import { LEDGER_CANISTER_ID } from '../../dfx/constants';
import { TOKENS } from '../../../constants/tokens';

export default (storage: any) => {
  return { 
    ...storage, wallets: storage.wallets.map(
    (wallet) => {
      delete wallet.assets.null;
      return ({
        ...wallet,
        assets: { [LEDGER_CANISTER_ID]: { amount: '0', token: TOKENS.ICP }, ...wallet.assets },
      })
    })
  }
};
