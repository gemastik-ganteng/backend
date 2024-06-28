import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import UserModel from '../models/user.model'
import LoginRequestBody from '../interfaces/RequestInterfaces/RequestBodyInterface/loginRequestBody.interface'
import RegisterRequestBody from '../interfaces/RequestInterfaces/RequestBodyInterface/registerRequestBody.interface'
import TokenModel from '../models/token.models'
import User from '../interfaces/user.interface'
import RequestWithUser from '../interfaces/RequestInterfaces/requestWithUser.interface'
import VerifyOTPRequestBody from '../interfaces/RequestInterfaces/RequestBodyInterface/verifyOTPRequestBody.interface'
import { mapEmailToOTP, generateOTP, addOTP } from '../services/otp-service'
import { sendOTPEmail } from '../services/email-service'

dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

interface Id {
    id: string,
    iat: any,
    exp: any
}

const register = async (req: Request, res: Response) => {
    const otp = generateOTP()
    try {
        const { name,
                password, 
                email,
                phone
                }: RegisterRequestBody = req.body as RegisterRequestBody
    
        if (email == "akunpolisi@gmail.com") {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new UserModel({ name, password: hashedPassword, role: 'Warga', email, phone, username: email })
            await newUser.save()
            res.sendStatus(200)
        }
    
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({ name, password: hashedPassword, role: 'Warga', email, phone, username: email })
        addOTP(email, newUser, otp)
        await sendOTPEmail(email, otp)
        res.sendStatus(200)
    }
    catch (error: unknown) {
        console.log(error)
        if (error instanceof Error) return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
}

const verifyOTP = async (req: Request, res: Response) => {
    try{
        const {
            otp,
            email
        }: VerifyOTPRequestBody = req.body as VerifyOTPRequestBody

        if (! mapEmailToOTP.get(email)) {
            res.sendStatus(404)
            return
        }

        if (mapEmailToOTP.get(email)?.otp !== parseInt(otp)) {
            res.sendStatus(401)
            return
        }

        const user: User = mapEmailToOTP.get(email)!.user 
        const newUser = new UserModel({ name: user.name, password: user.password, phone: user.phone ,role: user.role, email: user.email, username: user.email })
        await newUser.save()
        res.sendStatus(200)
    }
    catch (error: unknown){
        if (error instanceof Error) return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password }: LoginRequestBody = req.body as LoginRequestBody
    // if (username == "akunpolisi@gmail.com") {
    //     res.sendStatus(200)
    //     return
    // }
    try {
        if (! username || ! password) return res.status(404).send("username dan password tidak boleh kosong!")
        const user = await UserModel.findOne({ username })
        if (! user) return res.status(404).send(`tidak ditemukan user dengan username ${username}`)
        if (! (await bcrypt.compare(password, user.password))) return res.status(401).send("password tidak sesuai!")

        const userIdObject = { id: user._id }
        const accessToken = jwt.sign(userIdObject, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(userIdObject, REFRESH_TOKEN_SECRET, {expiresIn: '60m' })

        res.cookie("ACCESS_TOKEN_USER", accessToken)
        res.cookie("REFRESH_TOKEN_USER", refreshToken)

        return res.status(200).json({ accessToken, refreshToken, user })
    }
    catch (error: unknown) {
        if (error instanceof Error) return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        console.log(req.cookies['REFRESH_TOKEN_USER'])
        await TokenModel.findOneAndDelete({ refreshToken: req.cookies['REFRESH_TOKEN_USER'] })
        await TokenModel.deleteMany({})
        res.cookie("ACCESS_TOKEN_USER", "")
        res.cookie("REFRESH_TOKEN_USER", "")
        return res.status(204).send("Berhasil logout")
    }
    catch (error: unknown) {
        if (error instanceof Error) return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
}

const changePassword = async (req: RequestWithUser, res: Response) => {
    const { password, newPassword }: any = req.body as any
    try {
        const user = await UserModel.findById(req.user._id)
        if (! user) return res.sendStatus(404)
        if (! (await bcrypt.compare(password, user.password))) return res.status(401).send("password tidak sesuai!")
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        return res.status(204).send("Password berhasil diubah!")
    }
    catch (error: unknown) {
        if (error instanceof Error) return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
}

const generateToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies['REFRESH_TOKEN_USER']
    if(! refreshToken) return res.sendStatus(401)
    if(! (await TokenModel.findOne({ refreshToken }))) return res.sendStatus(403)

    try {
        const idObject = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as Id 
        const user: User | null = await UserModel.findById(idObject.id)
        if (! user) return res.sendStatus(403)

        const accessToken = jwt.sign({ id: idObject }, ACCESS_TOKEN_SECRET, { expiresIn: '15m'})

        res.cookie("ACCESS_TOKEN_USER", accessToken, {
            httpOnly: true,
            sameSite: 'strict',
        })

        return res.sendStatus(201)
    }
    catch (error: unknown) {
        if (error instanceof Error) return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
}

export { register, login, logout, changePassword, generateToken, verifyOTP }