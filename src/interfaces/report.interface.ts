import mongoose from 'mongoose';

interface Report {
    _id: mongoose.Schema.Types.ObjectId,
    email: string,
    namaPelapor: string,
    judul: string,
    jenisKejahatan: "Pencurian" | "Kekerasan" | "Perampokan" | "Musibah",
    waktuKejadian: string,
    tanggalKejadian: string,
    lokasiKejadian: string,
    deskripsi: string,
    files: string[] // Array of ObjectIds referencing uploaded files in GridFS
}

export default Report;
