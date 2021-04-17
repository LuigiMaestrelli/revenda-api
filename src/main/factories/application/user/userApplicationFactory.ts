import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';
import { UserApplication } from '@/application/usecases/user/userApplication';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';

export const makeUserApplication = (): UserApplication => {
    const hasher = new BcryptAdapter();
    const userRepository = makeUserRepository();
    return new UserApplication(hasher, userRepository, userRepository);
};
