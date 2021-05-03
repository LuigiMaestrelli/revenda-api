import { AutenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';

export interface IGenerateAuthentication {
    auth: (autentication: AutenticationAttributes) => Promise<AuthenticationResult>;
}
