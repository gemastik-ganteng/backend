import nodemailer from 'nodemailer';

export const sendOTPEmail = async (to: string, otp: number) => {
    // Konfigurasi transport email menggunakan SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false, // true untuk port 465, false untuk port lainnya
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Opsi email
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: 'OTP Code WargaJaga',
        text: `Your OTP code is ${otp}. Under 1 minute, please complete your registration using the provided otp.`
    };

    // Mengirim email
    await transporter.sendMail(mailOptions);
};
