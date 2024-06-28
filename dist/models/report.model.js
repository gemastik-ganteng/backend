"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reportSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    namaPelapor: {
        type: String
    },
    judul: {
        type: String,
        required: true
    },
    jenisKejahatan: {
        type: String,
        required: true
    },
    waktuKejadian: {
        type: String,
        required: true
    },
    tanggalKejadian: {
        type: String,
        required: true
    },
    lokasiKejadian: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    files: [{
            type: String,
            required: true
        }]
});
const ReportModel = mongoose_1.default.model('Report', reportSchema);
exports.default = ReportModel;
