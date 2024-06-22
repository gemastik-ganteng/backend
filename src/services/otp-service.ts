import User from "../interfaces/user.interface";

export interface UserOTP {
    user: User,
    otp: number
}

export const mapEmailToOTP = new Map<string, UserOTP>()

export const generateOTP = () => {
    const otp = Math.floor((Math.random()*1000000)+1);
    return otp;
};

export const addOTP = (email: string, user: User, otp: number) => {
    const userOTP: UserOTP = { user, otp };
    mapEmailToOTP.set(email, userOTP);

    setTimeout(() => {
        mapEmailToOTP.delete(email);
        console.log(`OTP for ${email} has been removed after 1 minute`);
    }, 60000);
};