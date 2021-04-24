import jwt from 'jsonwebtoken';
import { TokenPayload, AuthenticationResult } from '@/domain/models/auth/authentication';
import { TokenSigner } from '@/infra/interfaces/tokenSigner';

export class JwtAdapter implements TokenSigner {
    constructor(
        private readonly secretTokenKey: string,
        private readonly secretRefreshTokenKey: string,
        private readonly expiresIn: number
    ) {}

    async sign(payload: TokenPayload): Promise<AuthenticationResult> {
        return await new Promise(resolve => {
            const token = jwt.sign(payload, this.secretTokenKey, {
                algorithm: 'HS256',
                expiresIn: `${this.expiresIn}h`
            });
            const refreshToken = jwt.sign(payload, this.secretRefreshTokenKey, {
                algorithm: 'HS256',
                expiresIn: '30d'
            });

            const expiresInSeconds = this.expiresIn * 3600;

            resolve({
                token: token,
                refreshToken: refreshToken,
                expiresIn: expiresInSeconds
            });
        });
    }
}
