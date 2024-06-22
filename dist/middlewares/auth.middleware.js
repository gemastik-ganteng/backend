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
exports.authenticateUser = void 0;
const auth_controller_1 = require("../controllers/auth.controller");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
dotenv_1.default.config();
function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeaders = req.headers['authorization'];
        var accessToken = authHeaders === null || authHeaders === void 0 ? void 0 : authHeaders.split(' ')[1];
        if (accessToken === undefined) {
            return res.sendStatus(401);
        }
        try {
            var idObject = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            var user = yield user_model_1.default.findById(idObject.id);
            if (!user) {
                (0, auth_controller_1.generateToken)(req, res);
                accessToken = req.cookies['ACCESS_TOKEN_USER'];
                idObject = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                user = yield user_model_1.default.findById(idObject.id);
                if (user) {
                    req.user = user;
                    console.log("::", user);
                    next();
                    return;
                }
                res.status(403).send("Anda harus login terlebih dahulu.");
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            if (error instanceof Error)
                res.status(503).json({ message: error.message });
            else
                res.sendStatus(500);
        }
    });
}
exports.authenticateUser = authenticateUser;
