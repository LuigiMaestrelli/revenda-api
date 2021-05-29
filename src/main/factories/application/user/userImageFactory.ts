import { UserImageUseCase } from '@/application/usecases/user/userImage';
import { makeUserImageRepository } from '@/main/factories/repository/user/userImageRepositoryFactory';
import { SharpAdapter } from '@/infra/adapters/images/sharpAdapter';

export const makeUserImageUseCase = (): UserImageUseCase => {
    const userImageRepository = makeUserImageRepository();
    const imageManipulation = new SharpAdapter();
    return new UserImageUseCase(userImageRepository, imageManipulation);
};
