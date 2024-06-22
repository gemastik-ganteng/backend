"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        require: true,
    },
    jenisKejahatan: {
        type: String,
        require: true
    },
    waktuKejadian: {
        type: Date,
        require: true
    },
    lokasiKejadian: {
        type: String,
        require: true
    },
    deskripsi: {
        type: String,
        require: true
    }
});
const ReportModel = mongoose_1.default.model('ReportModel', reportSchema);
exports.default = ReportModel;
