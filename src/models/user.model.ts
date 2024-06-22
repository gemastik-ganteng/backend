import mongoose from "mongoose";
import User from "../interfaces/user.interface";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String
    },
    username: {
        type: String,
        required: true,
        unique: true // pastikan username unik
    }
})

const UserModel = mongoose.model<User & mongoose.Document>('UserModel', userSchema)

export default UserModel