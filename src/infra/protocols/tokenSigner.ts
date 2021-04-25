import { AuthenticationResult, TokenPayload } from '@/domain/models/auth/authentication';

export interface ITokenSigner {
    sign: (payload: TokenPayload) => Promise<AuthenticationResult>;
}
