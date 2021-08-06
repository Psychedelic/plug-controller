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
  const TransactionId = IDL.Nat64;
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
  const EventDetail = IDL.Variant({
    ChargingStationDeployed: IDL.Record({ canister: IDL.Principal }),
    Burn: IDL.Record({ to: IDL.Principal, from: IDL.Principal }),
    Mint: IDL.Record({ to: IDL.Principal }),
    CanisterCreated: IDL.Record({ canister: IDL.Principal }),
    CanisterCalled: IDL.Record({
      method_name: IDL.Text,
      canister: IDL.Principal,
    }),
    Transfer: IDL.Record({ to: IDL.Principal, from: IDL.Principal }),
  });
  const Event = IDL.Record({
    fee: IDL.Nat64,
    kind: EventDetail,
    timestamp: IDL.Nat64,
    cycles: IDL.Nat64,
  });

  const EventsConnection = IDL.Record({
    data: IDL.Vec(Event),
    next_canister_id: IDL.Opt(IDL.Principal),
  });
  return IDL.Service({
    meta: IDL.Func([], [TokenMetaData], ['query']),
    meta_certified: IDL.Func([], [TokenMetaData], []),
    balance: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Nat64], []),
    events: IDL.Func(
      [IDL.Record({ after: IDL.Opt(IDL.Nat), limit: IDL.Nat16 })],
      [EventsConnection],
      []
    ),
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
