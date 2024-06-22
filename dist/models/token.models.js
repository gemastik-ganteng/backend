"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true
    }
});
const TokenModel = mongoose_1.default.model('TokenModel', tokenSchema);
exports.default = TokenModel;
