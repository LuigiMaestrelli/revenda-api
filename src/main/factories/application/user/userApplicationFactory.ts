import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';
import { UserApplication } from '@/application/usecases/user/userApplication';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';
import { makeAuthApplication } from '@/main/factories/application/auth/authApplicationFactory';

export const makeUserApplication = (): UserApplication => {
    const hasher = new BcryptAdapter();
    const userRepository = makeUserRepository();
    const authApplication = makeAuthApplication();

    return new UserApplication(hasher, userRepository, userRepository, authApplication);
};
