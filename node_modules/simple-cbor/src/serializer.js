"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cbor = __importStar(require("./value"));
const BufferClasses = [
    ArrayBuffer,
    Uint8Array,
    Uint16Array,
    Uint32Array,
    Int8Array,
    Int16Array,
    Int32Array,
    Float32Array,
    Float64Array,
];
class JsonDefaultCborEncoder {
    // @param _serializer The CBOR Serializer to use.
    // @param _stable Whether or not keys from objects should be sorted (stable). This is
    //     particularly useful when testing encodings between JSON objects.
    constructor(_serializer, _stable = false) {
        this._serializer = _serializer;
        this._stable = _stable;
        this.name = "jsonDefault";
        this.priority = -100;
    }
    match(value) {
        return ["undefined", "boolean", "number", "string", "object"].indexOf(typeof value) != -1;
    }
    encode(value) {
        switch (typeof value) {
            case "undefined":
                return cbor.undefined_();
            case "boolean":
                return cbor.bool(value);
            case "number":
                if (Math.floor(value) === value) {
                    return cbor.number(value);
                }
                else {
                    return cbor.doubleFloat(value);
                }
            case "string":
                return cbor.string(value);
            case "object":
                if (value === null) {
                    return cbor.null_();
                }
                else if (Array.isArray(value)) {
                    return cbor.array(value.map((x) => this._serializer.serializeValue(x)));
                }
                else if (BufferClasses.find((x) => value instanceof x)) {
                    return cbor.bytes(value.buffer);
                }
                else if (Object.getOwnPropertyNames(value).indexOf("toJSON") !== -1) {
                    return this.encode(value.toJSON());
                }
                else if (value instanceof Map) {
                    const m = new Map();
                    for (const [key, item] of value.entries()) {
                        m.set(key, this._serializer.serializeValue(item));
                    }
                    return cbor.map(m, this._stable);
                }
                else {
                    const m = new Map();
                    for (const [key, item] of Object.entries(value)) {
                        m.set(key, this._serializer.serializeValue(item));
                    }
                    return cbor.map(m, this._stable);
                }
            default:
                throw new Error("Invalid value.");
        }
    }
}
exports.JsonDefaultCborEncoder = JsonDefaultCborEncoder;
class ToCborEncoder {
    constructor() {
        this.name = "cborEncoder";
        this.priority = -90;
    }
    match(value) {
        return typeof value == "object" && typeof value["toCBOR"] == "function";
    }
    encode(value) {
        return value.toCBOR();
    }
}
exports.ToCborEncoder = ToCborEncoder;
class CborSerializer {
    constructor() {
        this._encoders = new Set();
    }
    static withDefaultEncoders(stable = false) {
        const s = new this();
        s.addEncoder(new JsonDefaultCborEncoder(s, stable));
        s.addEncoder(new ToCborEncoder());
        return s;
    }
    removeEncoder(name) {
        // Has to make an extra call to values() to ensure it doesn't break on iteration.
        for (const encoder of this._encoders.values()) {
            if (encoder.name == name) {
                this._encoders.delete(encoder);
            }
        }
    }
    addEncoder(encoder) {
        this._encoders.add(encoder);
    }
    getEncoderFor(value) {
        let chosenEncoder = null;
        for (const encoder of this._encoders) {
            if (!chosenEncoder || encoder.priority > chosenEncoder.priority) {
                if (encoder.match(value)) {
                    chosenEncoder = encoder;
                }
            }
        }
        if (chosenEncoder === null) {
            throw new Error("Could not find an encoder for value.");
        }
        return chosenEncoder;
    }
    serializeValue(value) {
        return this.getEncoderFor(value).encode(value);
    }
    serialize(value) {
        return this.serializeValue(value);
    }
}
exports.CborSerializer = CborSerializer;
class SelfDescribeCborSerializer extends CborSerializer {
    serialize(value) {
        return cbor.raw(new Uint8Array([
            // Self describe CBOR.
            ...new Uint8Array([0xd9, 0xd9, 0xf7]),
            ...new Uint8Array(super.serializeValue(value)),
        ]));
    }
}
exports.SelfDescribeCborSerializer = SelfDescribeCborSerializer;
//# sourceMappingURL=serializer.js.map