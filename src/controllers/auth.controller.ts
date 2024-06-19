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

dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

interface Id {
    id: string,
    iat: any,
    exp: any
}

const register = async (req: Request, res: Response) => {
    try {
        const { username,
                password, 
                loginAs, 
                }: RegisterRequestBody = req.body as RegisterRequestBody
        
        if (! ["Warga", "Pemerintah"].includes(loginAs)) {
            return res.status(404).json({ message: "Role Yang Dipilih Tidak Valid." })
        }

        // Hash Password dan buat User baru
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserModel({ username, password: hashedPassword, role: loginAs })
        const userId = newUser._id

        await newUser.save()

        res.status(200)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password }: LoginRequestBody = req.body as LoginRequestBody
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

        // const newToken = new TokenModel({ userId: user._id, refreshToken })
        // await newToken.save()

        res.status(200).json({ accessToken, refreshToken })
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        console.log(req.cookies['REFRESH_TOKEN_USER'])
        await TokenModel.findOneAndDelete({ refreshToken: req.cookies['REFRESH_TOKEN_USER'] })
        await TokenModel.deleteMany({})
        res.cookie("ACCESS_TOKEN_USER", "")
        res.cookie("REFRESH_TOKEN_USER", "")
        res.status(204).send("Berhasil logout")
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
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
        res.status(204).send("Password berhasil diubah!")
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
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

        res.sendStatus(201)
    }
    catch (error: unknown) {
        if (error instanceof Error) res.status(503).json({ message: error.message });
        else res.sendStatus(500);
    }
}

export { register, login, logout, changePassword, generateToken }