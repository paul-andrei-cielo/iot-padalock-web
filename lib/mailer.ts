import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (to: string, token: string) => {
  const resetLink = `${process.env.APP_URL}/reset-password/${token}`;

  return await transporter.sendMail({
    from: `"Padalock" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <h2>Password Reset Request</h2>

      <p>You requested a password reset.</p>

      <a href="${resetLink}">Click here to reset password</a>

      <p>This link expires in 15 minutes.</p>
    `,
  });
};