import { AuthenticationUseCase } from '@/application/usecases/auth/auth';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';
import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';
import { JwtAdapter } from '@/infra/adapters/cryptography/jwtAdapter';
import config from '@/main/config';

export const makeAuthenticationUseCase = (): AuthenticationUseCase => {
    const hasher = new BcryptAdapter();
    const userRepository = makeUserRepository();
    const tokenSigner = new JwtAdapter(
        config.getTokenSecretTokenKey(),
        config.getTokenSecretRefreshTokenKey(),
        config.getTokenSecretExpires()
    );

    return new AuthenticationUseCase(tokenSigner, hasher, userRepository);
};
