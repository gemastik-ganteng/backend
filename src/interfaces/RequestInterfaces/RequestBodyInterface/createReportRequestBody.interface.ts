import mongoose from "mongoose"

interface CreateReportRequestBody {
    jenisTindakan: string,
    lokasiKejadian: string,
    waktuKejadian: string,
    tanggalKejadian: string,
    judul: string,
    deskripsiKejadian: string,
    email: string,
    any:  Express.Multer.File;
}

export default CreateReportRequestBody