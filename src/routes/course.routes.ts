import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import * as CourseController from '../controllers/course.controller';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', verifyToken, requireRole(Role.EDUCATOR), CourseController.createCourse);//
router.get('/', verifyToken, CourseController.getAllCourses);//
router.get('/:courseId', verifyToken, CourseController.getCourseById);//
router.patch('/:courseId', verifyToken, requireRole(Role.EDUCATOR), CourseController.updateCourse);//
router.delete('/:courseId', verifyToken, requireRole(Role.EDUCATOR, Role.ADMIN), CourseController.deleteCourse);

router.get('/:courseId/sections', verifyToken, CourseController.getSections);//
router.post('/:courseId/sections', verifyToken, requireRole(Role.EDUCATOR), CourseController.addSection);//
router.patch('/:courseId/sections/:sectionId', verifyToken, requireRole(Role.EDUCATOR), CourseController.updateSection);//
router.delete('/:courseId/sections/:sectionId', verifyToken, requireRole(Role.EDUCATOR), CourseController.deleteSection);

router.get('/:courseId/sections/:sectionId/lessons', verifyToken, CourseController.getLessons);//
router.post('/:courseId/sections/:sectionId/lessons', verifyToken, requireRole(Role.EDUCATOR), CourseController.addLesson);//
router.patch('/:courseId/sections/:sectionId/lessons/:lessonId', verifyToken, requireRole(Role.EDUCATOR), CourseController.updateLesson);//
router.delete('/:courseId/sections/:sectionId/lessons/:lessonId', verifyToken, requireRole(Role.EDUCATOR), CourseController.deleteLesson);

export default router;