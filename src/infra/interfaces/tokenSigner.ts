import { AuthenticationData, TokenPayload } from '@/domain/models/auth/authentication';

export interface TokenSigner {
    sign: (payload: TokenPayload) => Promise<AuthenticationData>;
}
