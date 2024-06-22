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
exports.deleteReportById = exports.getReportById = exports.getAllReport = exports.createReport = void 0;
const report_model_1 = __importDefault(require("../models/report.model"));
const createReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jenisKejahatan, lokasiKejadian, deskripsi } = req.body;
        const newReport = new report_model_1.default({ userId: req.user._id, jenisKejahatan, lokasiKejadian, deskripsi, waktuKejadian: new Date() });
        yield newReport.save();
        res.status(204).json(newReport);
    }
    catch (error) {
        if (error instanceof Error)
            res.status(503).json({ message: error.message });
        else
            res.sendStatus(500);
    }
});
exports.createReport = createReport;
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
