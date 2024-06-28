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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBuktiById = exports.getFilesBase64ByIds = void 0;
const report_model_1 = __importDefault(require("../models/report.model"));
const server_1 = require("../server");
const mongodb_1 = require("mongodb");
// Fungsi untuk mengambil base64 dari sekelompok file berdasarkan array file IDs
const getFilesBase64ByIds = (fileIds) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("MASUK MEKKK");
    try {
        const base64List = [];
        // Menggunakan aggregation untuk mengambil file berdasarkan banyak ID
        const files = yield server_1.gfsBucket.find({ _id: { $in: fileIds.map(id => new mongodb_1.ObjectId(id)) } }).toArray();
        console.log("MASUK MEKI14");
        // Mengonversi setiap file ke base64
        const base64Promises = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const buffers = [];
                const downloadStream = server_1.gfsBucket.openDownloadStream(file._id);
                downloadStream.on('data', (chunk) => {
                    buffers.push(chunk);
                });
                downloadStream.on('error', (error) => {
                    console.error('Error reading stream:', error.message);
                    reject(error);
                });
                downloadStream.on('end', () => {
                    console.log('Stream reading finished');
                    const buffer = Buffer.concat(buffers);
                    const base64String = buffer.toString('base64');
                    resolve(base64String);
                });
            });
        }));
        // Await all promises to complete
        const base64Files = yield Promise.all(base64Promises);
        return base64Files;
    }
    catch (error) {
        console.log("error " + error);
        throw error;
    }
});
exports.getFilesBase64ByIds = getFilesBase64ByIds;
// Fungsi untuk mendapatkan data bukti berdasarkan ID laporan
const getBuktiById = (reportId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Mengambil laporan berdasarkan ID
        const report = yield report_model_1.default.findById(reportId).exec();
        if (!report) {
            throw new Error('Report not found');
        }
        // Panggil fungsi untuk mengambil base64 dari grup file IDs
        const base64List = yield (0, exports.getFilesBase64ByIds)(report.files);
        return base64List;
    }
    catch (error) {
        throw error;
    }
});
exports.getBuktiById = getBuktiById;
