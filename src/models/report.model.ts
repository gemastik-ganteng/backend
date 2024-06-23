import mongoose from 'mongoose';
import Report from '../interfaces/report.interface';

const reportSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
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
        type: Date,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File' // Reference to GridFS files
    }]
});

const ReportModel = mongoose.model<Report & mongoose.Document>('Report', reportSchema);

export default ReportModel;
