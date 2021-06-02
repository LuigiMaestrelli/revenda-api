import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';

export interface IUserImageRepository {
    setImage: (imageData: CreateUserImageAttributes) => Promise<UserImageAttributes>;
    findById: (id: string) => Promise<UserImageAttributes>;
}
