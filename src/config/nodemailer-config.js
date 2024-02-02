import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.MAIL_ACCOUNT,
        pass: process.env.MAIL_PASS
    }
});

export default transporter;