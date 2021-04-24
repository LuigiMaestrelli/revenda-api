import { AutenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';

export interface IGenerateAuthApplication {
    auth: (autentication: AutenticationAttributes) => Promise<AuthenticationResult>;
}
