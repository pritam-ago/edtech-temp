import express, { Router } from 'express';
import e, { Request, Response } from 'express';
import { getUserData, updateUserData, changePassword, deleteAccount } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router: Router = express.Router();

router.get('/', verifyToken,  (req: Request, res: Response) => getUserData(req, res));//
router.patch('/', verifyToken, (req: Request, res: Response) => updateUserData(req, res));//
router.patch('/change-password', verifyToken, (req: Request, res: Response) => changePassword(req, res));//
router.delete('/delete-account', verifyToken, (req: Request, res: Response) => deleteAccount(req, res));

export default router;