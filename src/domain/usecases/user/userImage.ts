import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';

export interface IUserImageUseCase {
    setImage: (imageData: CreateUserImageAttributes) => Promise<UserImageAttributes>;
    findById: (id: string) => Promise<UserImageAttributes>;
}
