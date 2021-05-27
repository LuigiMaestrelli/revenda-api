import { IUserImageUseCase } from '@/domain/usecases/user/userImage';
import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { IUserImageRepository } from '@/domain/repository/user/userImage';
import { NotFoundError } from '@/shared/errors/notFoundError';

export class UserImageUseCase implements IUserImageUseCase {
    constructor(private readonly userImageRepository: IUserImageRepository) {}

    async setImage(imageData: CreateUserImageAttributes): Promise<UserImageAttributes> {
        return await this.userImageRepository.setImage(imageData);
    }

    async findById(id: string): Promise<UserImageAttributes> {
        const userImage = await this.userImageRepository.findById(id);
        if (!userImage) {
            throw new NotFoundError('Image not found');
        }
        return userImage;
    }
}
