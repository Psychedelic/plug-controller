/* eslint-disable @typescript-eslint/camelcase */
export default ({ IDL }) => {
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
  const TransactionId = IDL.Nat;
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
    meta_certified: IDL.Func([], [TokenMetaData], []),
    balance: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Nat64], []),
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
  });
};
export const init = () => {
  return [];
};
