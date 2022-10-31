import * as proto from './ledger.proto';

const { AccountIdentifier, BlockHeight, ICPTs, Memo, Payment, SendRequest } = proto.ic_ledger.pb.v1;


export const formatProtoSendRequest = (args, encoded: boolean) => {
    const amount = args.amount; // 0.1 ICP
    const memo = args.opts?.memo || BigInt(0);
    const maxFee = args.opts?.fee ?? BigInt(10000);

    const toPb = AccountIdentifier.fromObject({ hash: Uint8Array.from(Buffer.from(args.to, 'hex')) });
    const amountPb = ICPTs.fromObject({ e8s: amount });
    const memoPb = Memo.fromObject({ memo: memo.toString(10) });
    const payment = Payment.fromObject({ receiverGets: amountPb});
    const maxFeePb = ICPTs.fromObject({ e8s: maxFee.toString(10) });

    const request = SendRequest.fromObject({to: toPb, payment, memo: memoPb, maxFee: maxFeePb});
    return encoded ? SendRequest.encode(request).finish() : request;
}

export const decodeBlockHeight = (blockHeight: Uint8Array) => {
    return BlockHeight.decode(blockHeight).toJSON();
};

export default proto;
