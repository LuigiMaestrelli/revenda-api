import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';

export interface IAddUserRepository {
    add: (userData: CreateUserAttributes) => Promise<UserAttributes>;
}

export interface IFindUserByEmailRepository {
    findUserByEmail: (email: string) => Promise<UserAttributes | null>;
}