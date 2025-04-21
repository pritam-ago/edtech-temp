// types/dynamic.ts
export interface VerifiedCredential {
    address?: string;
    email?: string;
    format: 'blockchain' | 'email';
    public_identifier: string;
    signInEnabled: boolean;
  }
  
  export interface DynamicUser {
    email: string;
    new_user: boolean;
    verified_credentials: VerifiedCredential[];
  }
  