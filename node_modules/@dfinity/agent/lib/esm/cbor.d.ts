import { BinaryBlob } from './types';
export declare enum CborTag {
    Uint64LittleEndian = 71,
    Semantic = 55799
}
export declare const encode: (value: any) => BinaryBlob;
export declare function decode<T>(input: Uint8Array): T;
