import { transporter } from "./transporter";
import 'dotenv/config'

const {MAIL_FROM, GMAIL_PASSWORD} = process.env;
console.log(MAIL_FROM, GMAIL_PASSWORD)

export const sendMail = (mailTo, subject, data) => {
    transporter.sendMail({
        from: MAIL_FROM,
        to: mailTo,
        subject,
        html: data
    }, (err, result ) => {
        if(err) console.log(err)
        else console.log(result)
    })
}