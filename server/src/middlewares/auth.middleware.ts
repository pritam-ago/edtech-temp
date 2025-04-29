import { Request, Response, NextFunction } from 'express';
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

interface AuthenticatedRequest extends Request {
  user?: any;
}

const ENV_URI = process.env.ENV_URI;

const client = jwksClient({
  jwksUri: `https://app.dynamic.xyz/api/v0/sdk/${ENV_URI}/.well-known/jwks`,
});

const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
  client.getSigningKey(header.kid!, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
};

export const verifyDynamicJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    getKey,
    {
      audience: 'http://localhost:3000',
      issuer: `app.dynamicauth.com/${ENV_URI}`,
    },
    (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      req.user = decoded;
      next();
    }
  );
};
