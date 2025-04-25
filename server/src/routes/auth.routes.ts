import express, { Router } from 'express';
import { Request, Response } from 'express';
import { register, verifyLogin} from '../controllers/auth.controller';
import { verifyDynamicJwt } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.post('/register',verifyDynamicJwt, (req: Request, res: Response) => register(req, res));//
router.post('/verifyLogin', verifyDynamicJwt, (req: Request, res: Response) => verifyLogin(req, res)); // Verify login route

export default router;