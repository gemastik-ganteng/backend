"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: process.env['PG_DATABASE_USER'],
    host: process.env['PG_DATABASE_HOST'],
    database: process.env['PG_DATABASE_NAME'],
    password: process.env['PG_DATABASE_PASSWORD'],
    port: parseInt((_a = process.env['PG_DATABASE_PORT']) !== null && _a !== void 0 ? _a : 'X'),
});
const query = (queryString) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield exports.pool.connect();
    const res = yield client.query(queryString);
    client.release();
    return res;
});
exports.default = query;
