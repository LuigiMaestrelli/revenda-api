import { UserImageRepository } from '@/infra/db/repository/user/userImage';
import { makeUserRepository } from './userRepositoryFactory';

export const makeUserImageRepository = (): UserImageRepository => {
    const userRepository = makeUserRepository();
    return new UserImageRepository(userRepository);
};
