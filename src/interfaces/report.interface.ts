import mongoose from 'mongoose';

interface Report {
    _id: mongoose.Schema.Types.ObjectId,
    userId: string,
    judul: string,
    jenisKejahatan: "Pencurian" | "Kekerasan" | "Perampokan" | "Musibah",
    waktuKejadian: Date,
    lokasiKejadian: string,
    deskripsi: string,
    files: mongoose.Types.ObjectId[] // Array of ObjectIds referencing uploaded files in GridFS
}

export default Report;
