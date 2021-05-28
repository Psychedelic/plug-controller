import { CborEncoder, CborValue } from "../src/index";
export declare class BigIntEncoder implements CborEncoder<BigInt> {
    constructor();
    readonly name = "bigint";
    readonly priority = -10;
    match(value: any): boolean;
    encode(v: bigint): CborValue;
}
