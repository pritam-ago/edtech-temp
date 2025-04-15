import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

interface DecodedToken extends JwtPayload {
    userId: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Token is missing' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Invalid or expired token' });
            return;
        }

        const decodedToken = decoded as DecodedToken;
        console.log('Decoded Token:', decodedToken);
        req.user = { id: decodedToken.userId };
        next();
    });
};