import { UserImageAttributes } from '@/domain/models/user/userImage';
import { HttpUploadFile } from '@/domain/models/infra/http';

export interface IUserImageUseCase {
    setImage: (userId: string, file: HttpUploadFile) => Promise<UserImageAttributes>;
    findById: (id: string) => Promise<UserImageAttributes>;
}
