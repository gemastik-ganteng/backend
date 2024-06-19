import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import mongoose from "mongoose"
import cors from "cors"
import authRouter from "./routes/auth.router"
import reportRouter from "./routes/report.router"

dotenv.config()

const app: Express = express()
const port = process.env.port || 4000

const MONGO_URL: string = process.env.DATABASE_URL || 'mongodb://localhost/gemastik-ui-backend'
mongoose.connect(MONGO_URL)
const db = mongoose.connection
db.once('open', () => console.log("Connected to Mongoose"))

app.use(cookieParser())
app.use( cors({ origin: 'http://localhost:3000', credentials: true,}) )
app.use(express.json())

app.use('/auth', authRouter)
app.use('/reports', reportRouter)
app.listen(port, () => console.log(`[server]: Server is running at http://localhost:${port}`))