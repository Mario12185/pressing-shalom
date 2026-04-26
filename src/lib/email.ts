import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  text,
  html
}: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: Number(process.env.BREVO_SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY
      }
    });

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
      html: html || text
    });

    console.log(`✅ Email ENVOYÉ à ${to} via Brevo`);
    return { success: true };
  } catch (error: any) {
    console.error(`❌ ÉCHEC envoi email Brevo: ${error.message}`);
    return { success: false, error: error.message };
  }
}