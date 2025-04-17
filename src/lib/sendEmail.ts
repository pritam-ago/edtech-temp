import nodemailer from 'nodemailer';

interface SendPasswordResetEmailOptions {
  to: string;
  otp: string;
}

interface sendEmailUpdateOptions {
  to: string;
  otp: string;
}

export async function sendPasswordResetEmail({ to, otp }: SendPasswordResetEmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"AM EdTech" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
    html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

