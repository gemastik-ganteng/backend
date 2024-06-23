import {Request, Response } from 'express'
import RequestWithUser from '../interfaces/RequestInterfaces/requestWithUser.interface'
import { uploadBukti } from '../services/bukti-service';
import ReportModel from '../models/report.model'
import CreateReportRequestBody from '../interfaces/RequestInterfaces/RequestBodyInterface/createReportRequestBody.interface';

const createReport = async (req: Request, res: Response) => {
    try{
        const { 
            jenisTindakan: jenisKejahatan, 
            lokasiKejadian,
            waktuKejadian,
            tanggalKejadian,
            judul,
            deskripsiKejadian: deskripsi,
            email,
        } = req.body as CreateReportRequestBody
				console.log("body", req.body)

				const files: Express.Multer.File[] = []
				for (var i = 0; ; i++) {
					if (! req.body.get(`files[${i}]`)) break;
					files.push(req.body.get(`files[${i}]`))
				}

				console.log("::",files)

        const newReport = new ReportModel({ 
            email: email,
            judul,
            lokasiKejadian, 
            jenisKejahatan,
            tanggalKejadian,
            deskripsi, 
            waktuKejadian})
				await uploadBukti(files, newReport)
        res.sendStatus(204)
        console.log('BERHASIL')
    }
    catch (error: unknown) {
        console.log('GAGAL')
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getAllReport = async (req: RequestWithUser, res: Response) => {
    try{
        const reports = await ReportModel.find({})
        res.status(200).json(reports)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const getReportById = async (req: RequestWithUser, res: Response) => {
    try{
        const idReport = req.params.id
        const report = await ReportModel.findById(idReport)

        res.status(200).json(report)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const deleteReportById = async (req: RequestWithUser, res: Response) => {
    try{
        const idReport = req.params.id
        console.log("::",idReport)
        console.log("-->",await ReportModel.findById(idReport))
        await ReportModel.findByIdAndDelete(idReport)

        res.sendStatus(204)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { createReport, getAllReport, getReportById, deleteReportById }
