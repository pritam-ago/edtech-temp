import { DynamicUser } from '../types/dynamic';

declare global {
  namespace Express {
    interface Request {
      user?: {DynamicUser,  id: string };
    }
  }
}

