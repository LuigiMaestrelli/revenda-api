import { TokenPayload } from '@/domain/models/auth/authentication';

export interface TokenValidation {
    validateToken: (token: string) => Promise<TokenPayload>;
    validateRefreshToken: (token: string) => Promise<TokenPayload>;
}
