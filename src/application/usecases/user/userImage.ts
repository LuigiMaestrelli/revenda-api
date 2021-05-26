import { IUserImageUseCase } from '@/domain/usecases/user/userImage';
import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { IUserImageRepository } from 'domain/repository/user/userImage';

export class UserImageUseCase implements IUserImageUseCase {
    constructor(private readonly userImageRepository: IUserImageRepository) {}

    async setImage(imageData: CreateUserImageAttributes): Promise<UserImageAttributes> {
        return await this.userImageRepository.setImage(imageData);
    }

    async findById(id: string): Promise<UserImageAttributes> {
        return await this.userImageRepository.findById(id);
    }
}
