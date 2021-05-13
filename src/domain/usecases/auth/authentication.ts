import { AuthenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';

export interface IGenerateAuthentication {
    auth: (autentication: AuthenticationAttributes) => Promise<AuthenticationResult>;
}
