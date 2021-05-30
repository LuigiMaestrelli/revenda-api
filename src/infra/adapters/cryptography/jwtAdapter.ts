import jwt from 'jsonwebtoken';
import { TokenPayload, AuthenticationResult } from '@/domain/models/auth/authentication';
import { ITokenSigner } from '@/infra/protocols/tokenSigner';
import { ITokenValidation } from '@/infra/protocols/tokenValidation';
import { UnauthorizedError } from '@/shared/errors';

export class JwtAdapter implements ITokenSigner, ITokenValidation {
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

    async validateToken(token: string): Promise<TokenPayload> {
        try {
            return await new Promise(resolve => {
                const decoded: any = jwt.verify(token, this.secretTokenKey);
                resolve({
                    userId: decoded.userId
                });
            });
        } catch (ex) {
            throw new UnauthorizedError(ex.message);
        }
    }

    async validateRefreshToken(token: string): Promise<TokenPayload> {
        try {
            return await new Promise(resolve => {
                const decoded: any = jwt.verify(token, this.secretRefreshTokenKey);
                resolve({
                    userId: decoded.userId
                });
            });
        } catch (ex) {
            throw new UnauthorizedError(ex.message);
        }
    }
}
