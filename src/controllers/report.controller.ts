import {Request, Response } from 'express'
import RequestWithUser from '../interfaces/RequestInterfaces/requestWithUser.interface'
import { uploadBukti } from '../services/bukti-service';
import ReportModel from '../models/report.model'

const createReport = async (req: Request, res: Response): Promise<void> => {

    const {
        jenisTindakan: jenisKejahatan,
        lokasiKejadian,
        waktuKejadian,
        tanggalKejadian,
        namaPelapor,
        judul,
        deskripsiKejadian: deskripsi,
        email,
        base64strFiles
      } = req.body;

      console.log(req.body)

      const newReport = new ReportModel({
        email,
        judul,
        lokasiKejadian,
        jenisKejahatan,
        tanggalKejadian,
        deskripsi,
        waktuKejadian,
        namaPelapor
        });
    
        console.log(req.body)

     try {
            await uploadBukti(base64strFiles, newReport); 
            res.sendStatus(204);
            console.log('BERHASIL');
          } catch (error: unknown) {
            console.log('GAGAL', error);
            if (error instanceof Error) {
              res.status(503).json({ message: error.message });
            } else {
              res.sendStatus(500);
            }
    }
  
  };

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
