import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getProgressByCourse = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }
    const learnerId = req.user.id;
    const { courseId } = req.params;
  
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: { learnerId_courseId: { learnerId, courseId } },
        include: {
          progress: true,
          course: {
            include: {
              sections: {
                include: { lessons: true }
              }
            }
          }
        }
      });
  
      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found for this course" });
      }
  
      const progressMap = new Map(
        enrollment.progress.map(p => [p.lessonId, p.completed])
      );
  
      let totalLessons = 0;
      let totalCompleted = 0;
  
      const sectionProgress = enrollment.course.sections.map(section => {
        const total = section.lessons.length;
        const completed = section.lessons.filter(lesson => progressMap.get(lesson.id)).length;
  
        totalLessons += total;
        totalCompleted += completed;
  
        return {
          sectionId: section.id,
          sectionTitle: section.title,
          totalLessons: total,
          completedLessons: completed,
          progressPercent: total ? Math.round((completed / total) * 100) : 0,
        };
      });
  
      const courseProgress = totalLessons
        ? Math.round((totalCompleted / totalLessons) * 100)
        : 0;
  
      res.status(200).json({
        courseId,
        courseTitle: enrollment.course.title,
        courseProgress,
        sectionProgress,
      });
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const updateProgressByLesson = async (req: Request, res: Response) => {
    const learnerId = req.user?.id;
    const { courseId, lessonId } = req.params;
    const { completed } = req.body;
  
    if (!learnerId) {
      return res.status(400).json({ message: "Learner ID is required" });
    }
  
    try {
      const enrollment = await prisma.enrollment.findUnique({
        where: { learnerId_courseId: { learnerId, courseId } },
      });
  
      if (!enrollment) {
        return res.status(404).json({ message: "Not enrolled in this course" });
      }
  
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });
  
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
  
      // Update progress for the specific lesson
      const progress = await prisma.progress.upsert({
        where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
        update: { completed, lastAccessed: new Date() },
        create: { enrollmentId: enrollment.id, lessonId, completed, lastAccessed: new Date() },
      });
  
      res.status(200).json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };