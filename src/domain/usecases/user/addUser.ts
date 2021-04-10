import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';

export interface IAddUserApplication {
    add: (userData: CreateUserAttributes) => Promise<UserAttributes>;
}

export interface IAddUserRepository {
    add: (userData: CreateUserAttributes) => Promise<UserAttributes>;
}
