import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getUserData = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }
  const userId = await prisma.user.findUnique({
    where: { email: req.user?.email as string },
    select: { id: true },
  }).then(user => user?.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        occupation: true,
        organization: true,
        phone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const updateUserData = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }
  const userId = await prisma.user.findUnique({
    where: { email: req.user?.email as string },
    select: { id: true },
  }).then(user => user?.id);

    const { name, occupation, organization, phone, walletAddress } = req.body;
    const data: { name?: string; occupation?: string; organization?: string; phone?: string; walletAddress?: string } = {};
    if (name) data.name = name;
    if (occupation) data.occupation = occupation;
    if (organization) data.organization = organization;
    if (phone) data.phone = phone;
    if (walletAddress) data.walletAddress = walletAddress;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: data
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteAccount = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }
  const userId = await prisma.user.findUnique({
    where: { email: req.user?.email as string },
    select: { id: true },
  }).then(user => user?.id);

  try {
    await prisma.user.delete({ where: { id: userId } });
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}