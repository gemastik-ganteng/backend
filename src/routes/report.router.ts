import { Router } from "express";
import { createReport, getAllReport, getReportById, getBuktiByByLaporanId, getAllReportByEmail } from "../controllers/report.controller";

const reportRouter: Router = Router()

reportRouter.post('', createReport)
reportRouter.post('/bukti', getBuktiByByLaporanId)

reportRouter.get('', getAllReport)
reportRouter.get('/email/:email', getAllReportByEmail)
reportRouter.get('/:id', getReportById)

export default reportRouter