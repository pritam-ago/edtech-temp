import { DynamicUser } from '../types/dynamic';

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: any;DynamicUser,  id: string 
};
    }
  }
}

