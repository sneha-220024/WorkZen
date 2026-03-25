import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: any[];
}

/**
 * Modular service for handling automated emails via SMTP.
 */
class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // using port 465 to bypass firewall/ISP blocks
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    /**
     * Send an email with optional attachments in a non-blocking/graceful failure manner.
     * @param options EmailOptions configuration including to, subject, html body, and attachments.
     * @returns Promise<boolean> indicating success
     */
    async sendEmail({ to, subject, html, attachments }: EmailOptions): Promise<boolean> {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn(`[EmailService] Credentials missing in .env. Skipping email to ${to}`);
            return false;
        }

        const mailOptions = {
            from: `"WorkZen" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`[EmailService] Email sent to ${to}: ${info.response}`);
            return true;
        } catch (error) {
            console.error(`[EmailService] Failed to send email to ${to}:`, error);
            // Non-blocking approach: we return false instead of throwing error
            return false;
        }
    }
}

export default new EmailService();
