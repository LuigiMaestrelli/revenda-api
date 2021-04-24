import { AuthenticationMiddleware } from '@/main/middlewares/authentication';
import { JwtAdapter } from '@/infra/adapters/cryptography/jwtAdapter';
import config from '@/main/config';

export const makeAuthenticationMiddleware = (): any => {
    const tokenSigner = new JwtAdapter(
        config.getTokenSecretTokenKey(),
        config.getTokenSecretRefreshTokenKey(),
        config.getTokenSecretExpires()
    );
    const authMiddleware = new AuthenticationMiddleware(tokenSigner);

    return authMiddleware.makeMiddleware();
};
