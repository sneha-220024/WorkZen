import dotenv from 'dotenv';
dotenv.config();

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function run() {
    console.log('Checking Email Configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS is present:', !!process.env.EMAIL_PASS);
    
    try {
        console.log('Attempting to send a test email to', 'prbhargav2007@gmail.com');
        const info = await transporter.sendMail({
            from: \`"WorkZen Test" <\${process.env.EMAIL_USER}>\`,
            to: 'prbhargav2007@gmail.com',
            subject: 'Test Email Verification',
            text: 'If you receive this, the SMTP transporter configuration is fully working!'
        });
        console.log('✅ Success! Response:', info.response);
    } catch(e: any) {
        console.error('❌ Failure sending email:', e.message);
        if (e.code) console.error('Error Code:', e.code);
        if (e.command) console.error('Error Command:', e.command);
    }
}
run();
