import { AuthenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';
import { NetworkAccessInfo } from '@/domain/models/auth/networkAccessInfo';

export interface IGenerateAuthentication {
    auth: (
        autentication: AuthenticationAttributes,
        networkAccessInfo: NetworkAccessInfo
    ) => Promise<AuthenticationResult>;
    refreshAuth: (refreshToken: string) => Promise<AuthenticationResult>;
}
