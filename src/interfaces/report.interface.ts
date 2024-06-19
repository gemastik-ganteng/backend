import mongoose from "mongoose"

interface Report {
    _id: mongoose.Schema.Types.ObjectId,
    userId: string,
    jenisKejahatan: "Pencurian" | "Kekerasan" | "Perampokan" | "Musibah",
    waktuKejadian: Date,
    lokasiKejadian: string,
    deskripsi: string
}

export default Report