import jwt from 'jsonwebtoken';
import { TokenPayload, AuthenticationData } from '@/domain/models/auth/authentication';
import { TokenSigner } from '@/infra/interfaces/tokenSigner';

export class JwtAdapter implements TokenSigner {
    constructor(private readonly secretKey: string, private readonly expiresIn: number) {}

    async sign(payload: TokenPayload): Promise<AuthenticationData> {
        return await new Promise(resolve => {
            const token = jwt.sign(payload, this.secretKey, { algorithm: 'HS256', expiresIn: `${this.expiresIn}h` });
            const refreshToken = jwt.sign(payload, this.secretKey, { algorithm: 'HS256', expiresIn: '30d' });

            const expiresInSeconds = this.expiresIn * 3600;

            resolve({
                token: token,
                refreshToken: refreshToken,
                expiresIn: expiresInSeconds
            });
        });
    }
}
