import { AuthApplication } from '@/application/usecases/auth/authApplication';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';
import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';
import { JwtAdapter } from '@/infra/adapters/cryptography/jwtAdapter';
import config from '@/main/config';

export const makeAuthApplication = (): AuthApplication => {
    const hasher = new BcryptAdapter();
    const userRepository = makeUserRepository();
    const tokenSigner = new JwtAdapter(
        config.getTokenSecretTokenKey(),
        config.getTokenSecretRefreshTokenKey(),
        config.getTokenSecretExpires()
    );

    return new AuthApplication(tokenSigner, hasher, userRepository);
};
