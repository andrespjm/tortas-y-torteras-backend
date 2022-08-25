import nodemailer from 'nodemailer'
import 'dotenv/config'

const {MAIL_FROM, GMAIL_PASSWORD} = process.env;


export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: MAIL_FROM,
        pass: GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

transporter.verify().then(() => console.log('Ready to send mails'))