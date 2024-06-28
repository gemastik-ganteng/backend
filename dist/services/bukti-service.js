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
exports.getBuktiByByLaporanIdPG = exports.uploadBukti = void 0;
const postgres_service_1 = __importDefault(require("./postgres-service"));
const uploadBuktiToPG = (laporanId, base64StrList) => __awaiter(void 0, void 0, void 0, function* () {
    const values = base64StrList.map(base64Str => `('${laporanId}', '${base64Str}')`).join(", ");
    const insertQuery = `
    INSERT INTO file (laporan_id, base64) VALUES ${values}
  	`;
    yield (0, postgres_service_1.default)(insertQuery);
});
const uploadBukti = (base64StrList, report) => __awaiter(void 0, void 0, void 0, function* () {
    if (!base64StrList || base64StrList.length === 0) {
        console.log('No files to upload');
        return;
    }
    try {
        yield uploadBuktiToPG(report._id.toString(), base64StrList);
    }
    catch (error) {
        console.error("Error uploading files:", error);
        throw error;
    }
});
exports.uploadBukti = uploadBukti;
const getBuktiByByLaporanIdPG = (laporanId) => __awaiter(void 0, void 0, void 0, function* () {
    let base64List = [];
    const res = yield (0, postgres_service_1.default)(`SELECT base64 from file where laporan_id = '${laporanId}'`);
    base64List = res.rows.map((data) => data.base64);
    return base64List;
});
exports.getBuktiByByLaporanIdPG = getBuktiByByLaporanIdPG;
