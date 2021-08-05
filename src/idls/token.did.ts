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
    allowance: IDL.Func(
      [
        IDL.Record({
          account: IDL.Principal,
          spender: IDL.Opt(IDL.Principal),
        }),
      ],
      [IDL.Nat],
      ['query']
    ),
    approval: IDL.Func(
      [IDL.Record({ amount: IDL.Nat, spender: IDL.Principal })],
      [],
      []
    ),
    balance: IDL.Func(
      [IDL.Opt(IDL.Principal)],
      [IDL.Record({ amount: IDL.Nat })],
      ['query']
    ),
    compute_fee: IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    meta: IDL.Func([], [TokenMetaData], ['query']),
    meta_certified: IDL.Func([], [TokenMetaData], []),
    total_supply: IDL.Func([], [IDL.Nat], ['query']),
    transfer: IDL.Func(
      [
        IDL.Record({
          to: IDL.Principal,
          notify: IDL.Opt(NotifyArgs),
          from: IDL.Opt(IDL.Principal),
          amount: IDL.Nat,
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
