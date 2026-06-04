import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { env } from "../config/env";

// --- Password Hashing ---
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// --- JWT ---
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
};

// --- OTP ---
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// --- Email ---
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    // Dev mode: just log the OTP
    console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    return;
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: env.EMAIL_FROM,
    to: email,
    subject: "VedaAI – Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: #f97316; padding: 28px 32px; text-align: center;">
          <h1 style="color: #fff; font-size: 24px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">VedaAI</h1>
          <p style="color: rgba(255,255,255,0.85); font-size: 13px; margin: 4px 0 0;">AI-Powered Question Paper Generator</p>
        </div>
        <div style="padding: 36px 32px; text-align: center;">
          <h2 style="font-size: 20px; color: #1a1a1a; margin: 0 0 8px;">Verify Your Email</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 28px;">Enter this 6-digit code to complete your registration.</p>
          <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; display: inline-block; margin-bottom: 28px;">
            <span style="font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #1a1a1a;">${otp}</span>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
        <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} VedaAI. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
