"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOTP = exports.generateOTP = exports.mapEmailToOTP = void 0;
exports.mapEmailToOTP = new Map();
const generateOTP = () => {
    const otp = Math.floor((Math.random() * 1000000) + 1);
    return otp;
};
exports.generateOTP = generateOTP;
const addOTP = (email, user, otp) => {
    const userOTP = { user, otp };
    exports.mapEmailToOTP.set(email, userOTP);
    setTimeout(() => {
        exports.mapEmailToOTP.delete(email);
        console.log(`OTP for ${email} has been removed after 1 minute`);
    }, 60000);
};
exports.addOTP = addOTP;
