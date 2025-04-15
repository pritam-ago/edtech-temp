import express, { Router } from 'express';
import { Request, Response } from 'express';
import { register, login, requestPasswordReset, verifyOtpAndResetPassword, resendOtp } from '../controllers/auth.controller';


const router: Router = express.Router();

router.post('/register', (req: Request, res: Response) => register(req, res));
router.post('/login', (req: Request, res: Response) => login(req, res));
router.post('/otp-generate', (req: Request, res: Response) => requestPasswordReset(req, res));
router.post('/reset-password', (req: Request, res: Response) => verifyOtpAndResetPassword(req, res));
router.post('/resend-otp', (req: Request, res: Response) => resendOtp(req, res));

export default router;