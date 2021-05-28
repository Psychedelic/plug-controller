import { CborEncoder, CborValue } from "../src/index";
export declare class DateStringEncoder implements CborEncoder<Date> {
    readonly name = "date";
    readonly priority = -10;
    match(value: any): boolean;
    encode(v: Date): CborValue;
}
export declare class DateNumberEncoder implements CborEncoder<Date> {
    readonly name = "date";
    readonly priority = -10;
    match(value: any): boolean;
    encode(v: Date): CborValue;
}
