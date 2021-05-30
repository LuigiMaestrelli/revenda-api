import { AuthenticationResult, TokenPayload } from '@/domain/models/auth/authentication';

export interface ITokenSigner {
    sign: (payload: TokenPayload) => Promise<AuthenticationResult>;
    validateToken: (token: string) => Promise<TokenPayload>;
    validateRefreshToken: (token: string) => Promise<TokenPayload>;
}
