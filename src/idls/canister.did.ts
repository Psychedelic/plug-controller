export default ({ IDL }: { IDL: any }) => {
  return IDL.Service({
    greet: IDL.Func([IDL.Text], [IDL.Text], []),
    http_request: IDL.Func([], [IDL.Text], []),
  });
};
