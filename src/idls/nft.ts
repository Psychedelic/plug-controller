/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
export default ({ IDL }) => {
  const Property = IDL.Record({ value: IDL.Text, name: IDL.Text });
  const TokenDesc = IDL.Record({
    id: IDL.Nat,
    url: IDL.Text,
    owner: IDL.Principal,
    desc: IDL.Text,
    name: IDL.Text,
    properties: IDL.Vec(Property),
  });
  const Operation = IDL.Variant({
    init: IDL.Null,
    claim: IDL.Null,
    approve: IDL.Null,
    transfer: IDL.Null,
  });
  const Time = IDL.Int;
  const StorageActor = IDL.Service({
    addRecord: IDL.Func(
      [
        IDL.Principal,
        Operation,
        IDL.Opt(IDL.Principal),
        IDL.Opt(IDL.Principal),
        IDL.Nat,
        Time,
      ],
      [IDL.Nat],
      []
    ),
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
  });
  const Token = IDL.Record({});
  const StreamingCallbackHttpResponse = IDL.Record({
    token: IDL.Opt(Token),
    body: IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    Callback: IDL.Record({
      token: Token,
      callback: IDL.Func([Token], [StreamingCallbackHttpResponse], ['query']),
    }),
  });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    streaming_strategy: IDL.Opt(StreamingStrategy),
    status_code: IDL.Nat16,
  });
  const ICPTs = IDL.Record({ e8s: IDL.Nat64 });
  const TransactionNotification = IDL.Record({
    to: IDL.Principal,
    to_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from: IDL.Principal,
    memo: IDL.Nat64,
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    amount: ICPTs,
    block_height: IDL.Nat64,
  });
  const Result = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  const ICPunk = IDL.Service({
    add_genesis_record: IDL.Func([], [IDL.Nat], []),
    data_of: IDL.Func([IDL.Nat], [TokenDesc], ['query']),
    delist: IDL.Func([IDL.Nat], [IDL.Bool], []),
    get_cycles: IDL.Func([], [IDL.Nat], ['query']),
    get_listed: IDL.Func([IDL.Nat], [IDL.Vec(IDL.Nat)], ['query']),
    get_storage_canister: IDL.Func([], [IDL.Opt(StorageActor)], ['query']),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    list: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Bool], []),
    name: IDL.Func([], [IDL.Text], ['query']),
    owner: IDL.Func([], [IDL.Principal], ['query']),
    owner_of: IDL.Func([IDL.Nat], [IDL.Opt(IDL.Principal)], ['query']),
    set_owner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    set_storage_canister_id: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    symbol: IDL.Func([], [IDL.Text], ['query']),
    total_supply: IDL.Func([], [IDL.Nat], ['query']),
    transaction_notification: IDL.Func([TransactionNotification], [Result], []),
    transfer_to: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Bool], []),
    user_tokens: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Nat)], ['query']),
  });
  return ICPunk;
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Text, IDL.Nat, IDL.Principal];
};
