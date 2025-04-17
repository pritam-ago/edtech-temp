import express from "express";
import { getProgressByCourse, updateProgressByLesson } from "../controllers/progress.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/course/:courseId", verifyToken, getProgressByCourse);//
router.patch("/course/:courseId/lesson/:lessonId", verifyToken, updateProgressByLesson);//

export default router;
