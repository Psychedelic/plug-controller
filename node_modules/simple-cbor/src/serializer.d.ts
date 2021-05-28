import * as cbor from "./value";
import { CborValue } from "./value";
export interface CborEncoder<T> {
    readonly name: string;
    readonly priority: number;
    match(value: any): boolean;
    encode(value: T): cbor.CborValue;
}
export declare class JsonDefaultCborEncoder implements CborEncoder<any> {
    private _serializer;
    private _stable;
    constructor(_serializer: CborSerializer, _stable?: boolean);
    readonly name = "jsonDefault";
    readonly priority = -100;
    match(value: any): boolean;
    encode(value: any): cbor.CborValue;
}
export declare class ToCborEncoder implements CborEncoder<{
    toCBOR(): cbor.CborValue;
}> {
    readonly name = "cborEncoder";
    readonly priority = -90;
    match(value: any): boolean;
    encode(value: {
        toCBOR(): cbor.CborValue;
    }): cbor.CborValue;
}
export declare class CborSerializer {
    private _encoders;
    static withDefaultEncoders(stable?: boolean): CborSerializer;
    removeEncoder(name: string): void;
    addEncoder<T = any>(encoder: CborEncoder<T>): void;
    getEncoderFor<T = any>(value: any): CborEncoder<T>;
    serializeValue(value: any): CborValue;
    serialize(value: any): ArrayBuffer;
}
export declare class SelfDescribeCborSerializer extends CborSerializer {
    serialize(value: any): ArrayBuffer;
}
