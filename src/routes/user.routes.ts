import express, { Router } from 'express';
import e, { Request, Response } from 'express';
import { getUserData, updateUserData, deleteAccount } from '../controllers/user.controller';
import { verifyDynamicJwt } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.get('/', verifyDynamicJwt,  (req: Request, res: Response) => getUserData(req, res));//
router.patch('/', verifyDynamicJwt, (req: Request, res: Response) => updateUserData(req, res));//
router.delete('/delete-account', verifyDynamicJwt, (req: Request, res: Response) => deleteAccount(req, res));

export default router;