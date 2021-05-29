import { IUserImageUseCase } from '@/domain/usecases/user/userImage';
import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { IUserImageRepository } from '@/domain/repository/user/userImage';
import { NotFoundError } from '@/shared/errors/notFoundError';
import { HttpUploadFile } from '@/domain/models/infra/http';

export class UserImageUseCase implements IUserImageUseCase {
    constructor(private readonly userImageRepository: IUserImageRepository) {}

    async setImage(userId: string, file: HttpUploadFile): Promise<UserImageAttributes> {
        const imageData: CreateUserImageAttributes = {
            id: userId,
            image: file.buffer,
            imageSize: file.size,
            mimetype: file.mimetype,
            name: file.originalname,
            miniature: file.buffer,
            miniatureSize: file.size
        };

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
