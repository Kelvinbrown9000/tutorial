import nodemailer from 'nodemailer';

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendAdminChatAlert(sessionId, firstMessage) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email not configured — skipping chat alert email');
    return;
  }

  const transporter = getTransporter();
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/chat`;

  await transporter.sendMail({
    from: `"Guardian Trust Chat" <${process.env.SMTP_USER}>`,
    to: process.env.SUPPORT_EMAIL || 'support@guardiantrustfederal.org',
    subject: '💬 New customer waiting in Live Chat',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden">
        <div style="background:#0d1f3c;padding:20px 24px">
          <h2 style="color:#fff;margin:0;font-size:18px">New Customer in Live Chat</h2>
          <p style="color:#93c5fd;margin:4px 0 0;font-size:13px">Guardian Trust Federal Credit Union</p>
        </div>
        <div style="padding:24px">
          <p style="color:#18181b;margin:0 0 12px">A customer is waiting for support. Their first message:</p>
          <blockquote style="border-left:3px solid #1a4688;margin:0 0 20px;padding:12px 16px;background:#f0f7ff;border-radius:0 8px 8px 0;color:#18181b;font-style:italic">
            "${firstMessage}"
          </blockquote>
          <a href="${adminUrl}" style="display:inline-block;background:#1a4688;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
            Go Online &amp; Reply →
          </a>
          <p style="color:#71717a;font-size:12px;margin:20px 0 0">Session ID: ${sessionId}</p>
        </div>
      </div>
    `,
  });
}
