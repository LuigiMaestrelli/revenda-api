import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { IUserImageRepository } from '@/domain/repository/user/userImage';
import { IUserRepository } from '@/domain/repository/user/user';
import { NotFoundError } from '@/shared/errors/notFoundError';
import UserImageModel from '@/infra/db/model/user/userImageModel';

export class UserImageRepository implements IUserImageRepository {
    constructor(private readonly userRepository: IUserRepository) {}

    async setImage(imageData: CreateUserImageAttributes): Promise<UserImageAttributes> {
        const user = await this.userRepository.findById(imageData.id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const [image] = await UserImageModel.upsert(imageData);
        return image;
    }

    async findById(id: string): Promise<UserImageAttributes> {
        const imageData = await UserImageModel.findByPk(id);
        if (!imageData) {
            throw new NotFoundError('Image not found');
        }

        return imageData;
    }
}
