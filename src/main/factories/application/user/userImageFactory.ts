import { UserImageUseCase } from '@/application/usecases/user/userImage';
import { makeUserImageRepository } from '@/main/factories/repository/user/userImageRepositoryFactory';

export const makeUserImageUseCase = (): UserImageUseCase => {
    const userImageRepository = makeUserImageRepository();
    return new UserImageUseCase(userImageRepository);
};
