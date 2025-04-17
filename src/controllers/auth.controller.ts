import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { sendPasswordResetEmail } from '../lib/sendEmail';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

interface RegisterRequestBody {
  email: string;
  password: string;
  name?: string;
  role?: 'LEARNER' | 'EDUCATOR' | 'ADMIN';
  profileImage?: string;
  bio?: string;
  occupation?: string;
  organization?: string;
  phone?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface VerifyOtpAndResetPasswordRequestBody {
  email: string;
  otp: string;
  newPassword: string;
}

interface RequestPasswordResetRequestBody {
  email: string;
}

interface RequestPasswordResetResponseBody {
  message: string;
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  const {
    email,
    password,
    name = '',
    role = 'LEARNER',
    profileImage,
    bio,
    occupation,
    organization,
    phone,
  } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role.toUpperCase() as 'LEARNER' | 'EDUCATOR' | 'ADMIN',
        password: hashedPassword,
        profileImage,
        bio,
        occupation,
        organization,
        phone,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profileImage: user.profileImage,
        bio: user.bio,
        occupation: user.occupation,
        organization: user.organization,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,  
        name: user.name,
        profileImage: user.profileImage,
        bio: user.bio,
        occupation: user.occupation,
        organization: user.organization,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const requestPasswordReset = async (
  req: Request<{}, {}, RequestPasswordResetRequestBody>,
  res: Response<{ message: string }>) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await prisma.passwordReset.deleteMany({ where: { email } });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    await prisma.passwordReset.create({
      data: { email, otp, expiresAt },
    });

    await sendPasswordResetEmail({ to: email, otp });

    return res.json({ message: 'OTP sent to your email' });
};

export const verifyOtpAndResetPassword = async (
  req: Request<{}, {}, VerifyOtpAndResetPasswordRequestBody>,
  res: Response<{ message: string }>) => {
    const { email, otp, newPassword } = req.body;

    const resetRecord = await prisma.passwordReset.findFirst({
      where: { email, otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.deleteMany({ where: { email } });

    return res.json({ message: 'Password reset successful' });
};

export const resendOtp = async (
  req: Request<{}, {}, RequestPasswordResetRequestBody>,
  res: Response<RequestPasswordResetResponseBody>) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingOtp = await prisma.passwordReset.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();

    if (existingOtp && existingOtp.expiresAt > now) {
      
      await sendPasswordResetEmail({ to: email, otp: existingOtp.otp });
      return res.json({ message: 'OTP resent to your email' });
    }

    
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); 


    await prisma.passwordReset.deleteMany({ where: { email } });

    await prisma.passwordReset.create({
      data: { email, otp: newOtp, expiresAt },
    });

    await sendPasswordResetEmail({ to: email, otp: newOtp });

    return res.json({ message: 'New OTP sent to your email' });
};