require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function run() {
    console.log('Checking Email Configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    
    try {
        console.log('Attempting to send a background test email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Your App Password is Working!',
            text: 'If you receive this, your new App Password and email credentials have been correctly configured, meaning the email sending functionality itself works flawlessly!\n\nThe only step remaining is stopping your backend server in the terminal with Ctrl+C and running npm start again to load these credentials.'
        });
        console.log('✅ Success! Response:', info.response);
    } catch(e) {
        console.error('❌ Failure sending email:', e.message);
    }
}
run();
