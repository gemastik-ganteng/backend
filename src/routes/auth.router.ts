import { Router } from 'express'
import { register, login, logout, changePassword } from '../controllers/auth.controller'
import { authenticateUser } from '../middlewares/auth.middleware'

const authRouter: Router = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)

authRouter.patch('/change-password', authenticateUser, changePassword)

authRouter.delete('/logout', logout)

export default authRouter