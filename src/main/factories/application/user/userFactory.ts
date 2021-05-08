import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';
import { UserUseCase } from '@/application/usecases/user/user';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';
import { makeAuthenticationUseCase } from '@/main/factories/application/auth/authFactory';

export const makeUserUseCase = (): UserUseCase => {
    const hasher = new BcryptAdapter();
    const userRepository = makeUserRepository();
    const authenticationUseCase = makeAuthenticationUseCase();

    return new UserUseCase(hasher, userRepository, userRepository, authenticationUseCase, userRepository);
};
