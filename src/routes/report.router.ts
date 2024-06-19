import { Router } from "express";
import { createReport, getAllReport, getReportById, deleteReportById } from "../controllers/report.controller";
import { authenticateUser } from '../middlewares/auth.middleware'

const reportRouter: Router = Router()

reportRouter.post('', authenticateUser, createReport)

reportRouter.get('', authenticateUser, getAllReport)
reportRouter.get('/:id', authenticateUser, getReportById)

reportRouter.delete('/:id', authenticateUser, deleteReportById)

export default reportRouter