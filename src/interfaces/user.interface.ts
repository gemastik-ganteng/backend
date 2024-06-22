import mongoose from "mongoose"

interface User {
    _id: mongoose.Schema.Types.ObjectId,
    name: string,
    password: string,
    role: "Warga" | "Pemerintah",
    phone: string,
    email: string,
    username: string
}

export default User