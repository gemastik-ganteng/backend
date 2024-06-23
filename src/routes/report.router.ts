import { Router } from "express";
import { createReport, getAllReport, getReportById, deleteReportById, getBuktiByByLaporanId } from "../controllers/report.controller";

const reportRouter: Router = Router()

reportRouter.post('', createReport)
reportRouter.post('/bukti', getBuktiByByLaporanId)

reportRouter.get('', getAllReport)
reportRouter.get('/:id', getReportById)

reportRouter.delete('/:id', deleteReportById)

export default reportRouter