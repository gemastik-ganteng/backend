import { Router } from "express";
import { createReport, getAllReport, getReportById, deleteReportById, getBuktiByByLaporanId, getAllReportByEmail } from "../controllers/report.controller";

const reportRouter: Router = Router()

reportRouter.post('', createReport)
reportRouter.post('/bukti', getBuktiByByLaporanId)

reportRouter.get('', getAllReport)
reportRouter.get('/:id', getReportById)
reportRouter.get('/email/:email', getAllReportByEmail)
reportRouter.delete('/:id', deleteReportById)

export default reportRouter