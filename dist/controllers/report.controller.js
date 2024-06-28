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
exports.getAllReportByEmail = exports.getBuktiByByLaporanId = exports.deleteReportById = exports.getReportById = exports.getAllReport = exports.createReport = void 0;
const bukti_service_1 = require("../services/bukti-service");
const report_model_1 = __importDefault(require("../models/report.model"));
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jenisKejahatan, lokasiKejadian, waktuKejadian, tanggalKejadian, namaPelapor, judul, deskripsiKejadian: deskripsi, email, base64strFiles } = req.body;
    console.log(req.body);
    const newReport = new report_model_1.default({
        email,
        judul,
        lokasiKejadian,
        jenisKejahatan,
        tanggalKejadian,
        deskripsi,
        waktuKejadian,
        namaPelapor
    });
    console.log(req.body);
    yield newReport.save();
    try {
        yield (0, bukti_service_1.uploadBukti)(base64strFiles, newReport);
        res.sendStatus(204);
        console.log('BERHASIL');
    }
    catch (error) {
        console.log('GAGAL', error);
        if (error instanceof Error) {
            res.status(503).json({ message: error.message });
        }
        else {
            res.sendStatus(500);
        }
    }
});
exports.createReport = createReport;
const getAllReportByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.params.email;
    const reports = yield report_model_1.default.find({ email });
    res.status(200).json(reports);
});
exports.getAllReportByEmail = getAllReportByEmail;
const getAllReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield report_model_1.default.find({});
        res.status(200).json(reports);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(503).json({ message: error.message });
        else
            res.sendStatus(500);
    }
});
exports.getAllReport = getAllReport;
const getReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idReport = req.params.id;
        const report = yield report_model_1.default.findById(idReport);
        res.status(200).json(report);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(503).json({ message: error.message });
        else
            res.sendStatus(500);
    }
});
exports.getReportById = getReportById;
const deleteReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idReport = req.params.id;
        console.log("::", idReport);
        console.log("-->", yield report_model_1.default.findById(idReport));
        yield report_model_1.default.findByIdAndDelete(idReport);
        res.sendStatus(204);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(503).json({ message: error.message });
        else
            res.sendStatus(500);
    }
});
exports.deleteReportById = deleteReportById;
const getBuktiByByLaporanId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { laporanId } = req.body;
    const base64List = yield (0, bukti_service_1.getBuktiByByLaporanIdPG)(laporanId);
    res.json(base64List);
});
exports.getBuktiByByLaporanId = getBuktiByByLaporanId;
