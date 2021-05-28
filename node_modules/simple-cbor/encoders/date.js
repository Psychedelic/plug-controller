"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
class DateStringEncoder {
    constructor() {
        this.name = 'date';
        this.priority = -10;
    }
    match(value) {
        return value instanceof Date;
    }
    encode(v) {
        return index_1.value.tagged(0, index_1.value.string(v.toISOString()));
    }
}
exports.DateStringEncoder = DateStringEncoder;
class DateNumberEncoder {
    constructor() {
        this.name = 'date';
        this.priority = -10;
    }
    match(value) {
        return value instanceof Date;
    }
    encode(v) {
        return index_1.value.tagged(1, index_1.value.number((v.getTime() - new Date(0).getTime()) / 1000.0));
    }
}
exports.DateNumberEncoder = DateNumberEncoder;
//# sourceMappingURL=date.js.map