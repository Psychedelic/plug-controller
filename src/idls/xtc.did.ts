/* eslint-disable @typescript-eslint/camelcase */
export default ({ IDL }) => {
  const TransactionId = IDL.Nat64;
  const BurnError = IDL.Variant({
    InsufficientBalance: IDL.Null,
    InvalidTokenContract: IDL.Null,
    NotSufficientLiquidity: IDL.Null,
  });

  const TxReceipt = IDL.Variant({
    Err: IDL.Variant({
      InsufficientAllowance: IDL.Null,
      InsufficientBalance: IDL.Null,
    }),
    Ok: IDL.Nat,
  });

  const BurnResult = IDL.Variant({
    Ok: TransactionId,
    Err: BurnError,
  });
  const Metadata = IDL.Record ({
   decimals: IDL.Nat8,
   fee: IDL.Nat,
   logo: IDL.Text,
   name: IDL.Text,
   owner: IDL.Principal,
   symbol: IDL.Text,
   totalSupply: IDL.Nat,
  });
  const TokenMetaData = IDL.Record({
    features: IDL.Vec(IDL.Text),
    name: IDL.Text,
    decimal: IDL.Nat8,
    symbol: IDL.Text,
  });
  const NotifyArgs = IDL.Record({
    canister_id: IDL.Principal,
    method_name: IDL.Text,
  });
  const TransferError = IDL.Variant({
    CallFailed: IDL.Null,
    InsufficientBalance: IDL.Null,
    Unknown: IDL.Null,
    AmountTooLarge: IDL.Null,
  });
  const TransferResult = IDL.Variant({
    Ok: TransactionId,
    Err: TransferError,
  });
  return IDL.Service({
    meta: IDL.Func([], [TokenMetaData], ['query']),
    getMetadata: IDL.Func([], [Metadata], ['query']),
    meta_certified: IDL.Func([], [TokenMetaData], []),
    balance: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Nat64], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat],  ['query']),
    burn: IDL.Func(
      [IDL.Record({ canister_id: IDL.Principal, amount: IDL.Nat64 })],
      [BurnResult],
      []
    ),
    transfer: IDL.Func(
      [
        IDL.Record({
          to: IDL.Principal,
          from: IDL.Opt(IDL.Principal),
          amount: IDL.Nat64,
        }),
      ],
      [TransferResult],
      []
    ),
    transferErc20: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
  });
};
export const init = () => {
  return [];
};
