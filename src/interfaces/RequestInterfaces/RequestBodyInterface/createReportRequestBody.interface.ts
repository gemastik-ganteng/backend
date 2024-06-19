import mongoose from "mongoose"

interface CreateReportRequestBody {
    jenisKejahatan: "Pencurian" | "Kekerasan" | "Perampokan" | "Musibah",
    lokasiKejadian: string,
    deskripsi: string
}

export default CreateReportRequestBody