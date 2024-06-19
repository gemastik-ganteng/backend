import mongoose from 'mongoose'
import Report from '../interfaces/report.interface'

const reportSchema = new mongoose.Schema({
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
})

const ReportModel = mongoose.model<Report & mongoose.Document>('ReportModel', reportSchema)

export default ReportModel