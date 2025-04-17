import e, { Request, Response } from "express";
import prisma from "../lib/prisma";

export const createCourse = async (req: Request, res: Response) => {
  const { title, description, price, coverImage } = req.body;
  const creatorId = req.user?.id as string;

  try {
    const course = await prisma.course.create({
      data: { title, description, price, coverImage, creatorId },
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: "Error creating course" });
  }
};

export const getEducatorCourses = async (req: Request, res: Response) => {
  const creatorId = req.user?.id as string;

  const courses = await prisma.course.findMany({
    where: { creatorId },
    include: { sections: true },
  });

  res.json(courses);
};

export const getAllCourses = async (req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    include: { sections: { include: { lessons: true } } },
  });
  res.json(courses);
}

export const getCourseById = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { sections: { include: { lessons: true } } },
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const updates = req.body;

  try {
    const course = await prisma.course.update({
      where: { id: courseId },
      data: updates,
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Error updating course" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    await prisma.course.delete({ where: { id: courseId } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Error deleting course" });
  }
};

// ===== Sections =====

export const getSections = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  try {
    const sections = await prisma.section.findMany({
      where: { courseId },
      include: { lessons: true },
    });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: "Error fetching sections" });
  }
};

export const addSection = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, order } = req.body;

  try {
    const section = await prisma.section.create({
      data: { title, order, courseId },
    });
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: "Error adding section" });
  }
};

export const updateSection = async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  const updates = req.body;

  try {
    const section = await prisma.section.update({
      where: { id: sectionId },
      data: updates,
    });
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: "Error updating section" });
  }
};

export const deleteSection = async (req: Request, res: Response) => {
  const { sectionId } = req.params;

  try {
    await prisma.section.delete({ where: { id: sectionId } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Error deleting section" });
  }
};

// ===== Lessons =====

export const getLessons = async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  try {
    const lessons = await prisma.lesson.findMany({
      where: { sectionId },
    });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching lessons" });
  }
}

export const addLesson = async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  const { title, content, duration, order, videoUrl } = req.body;

  try {
    const lesson = await prisma.lesson.create({
      data: { title, content, duration, order, videoUrl, sectionId },
    });
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Error adding lesson" });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const updates = req.body;

  try {
    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updates,
    });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: "Error updating lesson" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  const { lessonId } = req.params;

  try {
    await prisma.lesson.delete({ where: { id: lessonId } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: "Error deleting lesson" });
  }
};
