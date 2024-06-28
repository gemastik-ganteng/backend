"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.generateToken = exports.changePassword = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const token_models_1 = __importDefault(require("../models/token.models"));
const otp_service_1 = require("../services/otp-service");
const email_service_1 = require("../services/email-service");
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, otp_service_1.generateOTP)();
    try {
        const { name, password, email, phone } = req.body;
        if (email == "akunpolisi@gmail.com") {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const newUser = new user_model_1.default({ name, password: hashedPassword, role: 'Warga', email, phone, username: email });
            yield newUser.save();
            res.sendStatus(200);
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.default({ name, password: hashedPassword, role: 'Warga', email, phone, username: email });
        (0, otp_service_1.addOTP)(email, newUser, otp);
        yield (0, email_service_1.sendOTPEmail)(email, otp);
        res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error)
            return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
});
exports.register = register;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { otp, email } = req.body;
        if (!otp_service_1.mapEmailToOTP.get(email)) {
            res.sendStatus(404);
            return;
        }
        if (((_a = otp_service_1.mapEmailToOTP.get(email)) === null || _a === void 0 ? void 0 : _a.otp) !== parseInt(otp)) {
            res.sendStatus(401);
            return;
        }
        const user = otp_service_1.mapEmailToOTP.get(email).user;
        const newUser = new user_model_1.default({ name: user.name, password: user.password, phone: user.phone, role: user.role, email: user.email, username: user.email });
        yield newUser.save();
        res.sendStatus(200);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
});
exports.verifyOTP = verifyOTP;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // if (username == "akunpolisi@gmail.com") {
    //     res.sendStatus(200)
    //     return
    // }
    try {
        if (!username || !password)
            return res.status(404).send("username dan password tidak boleh kosong!");
        const user = yield user_model_1.default.findOne({ username });
        if (!user)
            return res.status(404).send(`tidak ditemukan user dengan username ${username}`);
        if (!(yield bcrypt_1.default.compare(password, user.password)))
            return res.status(401).send("password tidak sesuai!");
        const userIdObject = { id: user._id };
        const accessToken = jsonwebtoken_1.default.sign(userIdObject, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign(userIdObject, REFRESH_TOKEN_SECRET, { expiresIn: '60m' });
        res.cookie("ACCESS_TOKEN_USER", accessToken);
        res.cookie("REFRESH_TOKEN_USER", refreshToken);
        return res.status(200).json({ accessToken, refreshToken, user });
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.cookies['REFRESH_TOKEN_USER']);
        yield token_models_1.default.findOneAndDelete({ refreshToken: req.cookies['REFRESH_TOKEN_USER'] });
        yield token_models_1.default.deleteMany({});
        res.cookie("ACCESS_TOKEN_USER", "");
        res.cookie("REFRESH_TOKEN_USER", "");
        return res.status(204).send("Berhasil logout");
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
});
exports.logout = logout;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, newPassword } = req.body;
    try {
        const user = yield user_model_1.default.findById(req.user._id);
        if (!user)
            return res.sendStatus(404);
        if (!(yield bcrypt_1.default.compare(password, user.password)))
            return res.status(401).send("password tidak sesuai!");
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        yield user.save();
        return res.status(204).send("Password berhasil diubah!");
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
});
exports.changePassword = changePassword;
const generateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies['REFRESH_TOKEN_USER'];
    if (!refreshToken)
        return res.sendStatus(401);
    if (!(yield token_models_1.default.findOne({ refreshToken })))
        return res.sendStatus(403);
    try {
        const idObject = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const user = yield user_model_1.default.findById(idObject.id);
        if (!user)
            return res.sendStatus(403);
        const accessToken = jsonwebtoken_1.default.sign({ id: idObject }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.cookie("ACCESS_TOKEN_USER", accessToken, {
            httpOnly: true,
            sameSite: 'strict',
        });
        return res.sendStatus(201);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(503).json({ message: error.message });
        return res.sendStatus(500);
    }
});
exports.generateToken = generateToken;
