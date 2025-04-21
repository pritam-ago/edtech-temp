import express from "express";
import { getProgressByCourse, updateProgressByLesson } from "../controllers/progress.controller";
import { verifyDynamicJwt } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/course/:courseId", verifyDynamicJwt, getProgressByCourse);//
router.patch("/course/:courseId/lesson/:lessonId", verifyDynamicJwt, updateProgressByLesson);//

export default router;
