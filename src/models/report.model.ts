import mongoose from 'mongoose';
import Report from '../interfaces/report.interface';

const reportSchema = new mongoose.Schema({
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

const ReportModel = mongoose.model<Report & mongoose.Document>('Report', reportSchema);

export default ReportModel;
