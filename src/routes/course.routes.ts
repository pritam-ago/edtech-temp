import express from 'express';
import { verifyDynamicJwt } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import * as CourseController from '../controllers/course.controller';
import { Role } from '@prisma/client';

const router = express.Router();

router.post('/', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.createCourse);//
router.get('/', verifyDynamicJwt, CourseController.getAllCourses);//
router.get('/:courseId', verifyDynamicJwt, CourseController.getCourseById);//
router.patch('/:courseId', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.updateCourse);//
router.delete('/:courseId', verifyDynamicJwt, requireRole(Role.EDUCATOR, Role.ADMIN), CourseController.deleteCourse);

router.get('/:courseId/sections', verifyDynamicJwt, CourseController.getSections);//
router.post('/:courseId/sections', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.addSection);//
router.patch('/:courseId/sections/:sectionId', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.updateSection);//
router.delete('/:courseId/sections/:sectionId', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.deleteSection);

router.get('/:courseId/sections/:sectionId/lessons', verifyDynamicJwt, CourseController.getLessons);//
router.post('/:courseId/sections/:sectionId/lessons', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.addLesson);//
router.patch('/:courseId/sections/:sectionId/lessons/:lessonId', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.updateLesson);//
router.delete('/:courseId/sections/:sectionId/lessons/:lessonId', verifyDynamicJwt, requireRole(Role.EDUCATOR), CourseController.deleteLesson);

export default router;