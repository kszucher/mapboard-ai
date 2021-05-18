"use strict";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'info@mindboard.io',
        pass: 'jH8fB1sB2lS4bQ7d'
    }
});

async function main() {
    let info = await transporter.sendMail({
        from: "info@mindboard.io",
        to: "christian.szucher@gmail.com",
        subject: "Message title",
        text: "Plaintext version of the message",
        html: "<p>HTML version of the message</p>"
    });
}

main().catch(console.error);
