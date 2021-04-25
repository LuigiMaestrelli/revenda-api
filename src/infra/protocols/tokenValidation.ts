import { TokenPayload } from '@/domain/models/auth/authentication';

export interface ITokenValidation {
    validateToken: (token: string) => Promise<TokenPayload>;
    validateRefreshToken: (token: string) => Promise<TokenPayload>;
}
