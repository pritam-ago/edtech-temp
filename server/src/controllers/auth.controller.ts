import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { DynamicUser } from '../types/dynamic';


interface RegisterRequestBody {
  name: string;
  role: 'LEARNER' | 'EDUCATOR' | 'ADMIN';
  occupation?: string;
  organization?: string;
  phone?: string;
}

interface VerifiedCredential {
  address?: string;
  email?: string;
  format: 'blockchain' | 'email';
  public_identifier: string;
  signInEnabled: boolean;
}



export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  const user = req.user as DynamicUser | undefined;
  console.log('User from middleware:', user);

  const dynamicUser = user as DynamicUser;
  const { email, verified_credentials } = dynamicUser;
  const walletAddress = verified_credentials.find(vc => vc.format === 'blockchain')?.address || null;
  const {
    name = '',
    role = 'LEARNER',
    occupation,
    organization,
    phone,
  } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        occupation,
        organization,
        phone,
        walletAddress,
      },
    });



    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        occupation: newUser.occupation,
        organization: newUser.organization,
        phone: newUser.phone,
        walletAddress: newUser.walletAddress,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};


export const verifyLogin = async (req: Request, res: Response) => {
  const user = req.user as DynamicUser | undefined;
  console.log('User from middleware:', user);

  const dynamicUser = user as DynamicUser;
  const { email, verified_credentials } = dynamicUser;
  const walletAddress = verified_credentials.find(vc => vc.format === 'blockchain')?.address || null;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (!existing) {
      return res.status(200).json({
        isRegistered: false,
        message: 'User is not registered',
      });
    }else{
      res.status(200).json({
      user: {
        id: existing.id,
        email: existing.email,
        role: existing.role,
        name: existing.name,
        occupation: existing.occupation,
        organization: existing.organization,
        phone: existing.phone,
        walletAddress,
      },
      isRegistered: true,
      });
    }

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
}