'use server'

import nodemailer from "nodemailer";

if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email configuration is incomplete. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, and EMAIL_FROM in your environment variables.");
}

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

function createEmailTemplate(subject: string, body: string): string {
    const appName = process.env.APP_NAME ?? "MyApp";
    const supportEmail = process.env.EMAIL_USER ?? "";
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>${subject}</title>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:'Sarabun',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0e0d8;">

            <!-- Header -->
            <tr>
                <td style="background:#1a1a18;padding:32px 40px;">
                    <p style="margin:0 0 16px;font-size:12px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#a0a096;">
                        ${appName}
                    </p>
                    <h1 style="margin:0;font-size:22px;font-weight:500;color:#f5f5f0;line-height:1.4;">
                        ${subject}
                    </h1>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding:36px 40px;">
                    <div style="font-size:15px;color:#3a3a36;line-height:1.8;">
                        ${body}
                    </div>
                    <hr style="border:none;border-top:1px solid #e8e8e2;margin:28px 0;"/>
                    <p style="margin:0;font-size:13px;color:#8a8a84;line-height:1.7;">
                        อีเมลนี้ถูกส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับ<br/>
                        หากมีข้อสงสัย ติดต่อเราได้ที่
                        <a href="mailto:${supportEmail}" style="color:#3a3a36;text-underline-offset:3px;">${supportEmail}</a>
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background:#f5f5f0;border-top:1px solid #e8e8e2;padding:18px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="font-size:12px;color:#a0a096;">© ${year} ${appName}</td>
                            <td align="right" style="font-size:12px;color:#a0a096;">ยกเลิกการรับอีเมล</td>
                        </tr>
                    </table>
                </td>
            </tr>

        </table>
    </td></tr>
</table>
</body>
</html>`;
}
export async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {
    try {
        await transporter.sendMail({
            from: `"${process.env.APP_NAME ?? "MyApp"}" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: createEmailTemplate(subject, text),
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}