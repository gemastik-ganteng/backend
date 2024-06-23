import { Router } from "express";
import { createReport, getAllReport, getReportById, deleteReportById, getBase64sFromIds } from "../controllers/report.controller";
import { authenticateUser } from '../middlewares/auth.middleware'

const reportRouter: Router = Router()

reportRouter.post('', createReport)
reportRouter.post('/tobase64', getBase64sFromIds)

reportRouter.get('', getAllReport)
reportRouter.get('/:id', getReportById)

reportRouter.delete('/:id', deleteReportById)

export default reportRouter