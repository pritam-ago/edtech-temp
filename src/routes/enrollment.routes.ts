import { Router } from "express";
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentByCourse,
  unenrollFromCourse,
} from "../controllers/enrollment.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(verifyToken);
router.use(requireRole("LEARNER"));

router.post("/", enrollInCourse);//
router.get("/me", getMyEnrollments);//
router.get("/:courseId", getEnrollmentByCourse);//
router.delete("/:courseId", unenrollFromCourse);

export default router;