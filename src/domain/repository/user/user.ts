import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';

export interface IAddUserRepository {
    add: (userData: CreateUserAttributes) => Promise<UserAttributes>;
}
