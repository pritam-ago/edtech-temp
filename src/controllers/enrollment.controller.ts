import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const enrollInCourse = async (req: Request, res: Response) => {
  const learnerId = req.user?.id as string;
  const { courseId } = req.body;

  try {
    const alreadyEnrolled = await prisma.enrollment.findUnique({
      where: { learnerId_courseId: { learnerId, courseId } },
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await prisma.enrollment.create({
      data: { learnerId, courseId },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Enrollment failed", error });
  }
};

export const getMyEnrollments = async (req: Request, res: Response) => {
  const learnerId = req.user?.id;
  if (!learnerId) {
    return res.status(400).json({ message: "Learner ID is required" });
  }
  try{
    const enrollments = await prisma.enrollment.findMany({
      where: { learnerId },
      include: {
        course: {
          include: { creator: true, sections: true },
        },
      },
    });
    res.status(200).json(enrollments);
  }
  catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getEnrollmentByCourse = async (req: Request, res: Response) => {
  const learnerId = req.user?.id;
  const { courseId } = req.params;

  if (!learnerId) {
    return res.status(400).json({ message: "Learner ID is required" });
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: { learnerId_courseId: { learnerId, courseId } },
    include: { progress: true, course: true },
  });

  if (!enrollment) {
    return res.status(404).json({ message: "Not enrolled in this course" });
  }

  res.status(200).json(enrollment);
};

export const unenrollFromCourse = async (req: Request, res: Response) => {
  const learnerId = req.user?.id;
  const { courseId } = req.params;

  if (!learnerId) {
    return res.status(400).json({ message: "Learner ID is required" });
  }

  try {
    await prisma.enrollment.delete({
      where: { learnerId_courseId: { learnerId, courseId } },
    });

    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to unenroll", error });
  }
};