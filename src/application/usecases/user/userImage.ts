import { IUserImageUseCase } from '@/domain/usecases/user/userImage';
import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { IUserImageRepository } from '@/domain/repository/user/userImage';
import { NotFoundError } from '@/shared/errors/notFoundError';
import { HttpUploadFile } from '@/domain/models/infra/http';
import { IImageManipulation } from '@/infra/protocols/imageManipulation';

export class UserImageUseCase implements IUserImageUseCase {
    constructor(
        private readonly userImageRepository: IUserImageRepository,
        private readonly imageManipulation: IImageManipulation
    ) {}

    async setImage(userId: string, file: HttpUploadFile): Promise<UserImageAttributes> {
        const miniature = await this.imageManipulation.resize(file.buffer, 300);
        const miniatureSize = await this.imageManipulation.getImageSize(miniature);

        const imageData: CreateUserImageAttributes = {
            id: userId,
            image: file.buffer,
            imageSize: file.size,
            mimetype: file.mimetype,
            name: file.originalname,
            miniature,
            miniatureSize
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
