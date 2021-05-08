import { CreateUserAttributes, UserAttributes, UpdateUserAttributes } from '@/domain/models/user/user';

export interface IAddUserRepository {
    add: (userData: CreateUserAttributes) => Promise<UserAttributes>;
}

export interface IFindUserByEmailRepository {
    findUserByEmail: (email: string) => Promise<UserAttributes>;
}

export interface IFindUserByIdRepository {
    findById: (id: string) => Promise<UserAttributes>;
}

export interface IUpdateUserRepository {
    update: (id: string, userData: UpdateUserAttributes) => Promise<UserAttributes>;
}
