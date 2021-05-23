import { CreateUserAttributes, UserAttributes, UpdateUserAttributes } from 'domain/models/user/user';

export interface IUserRepository {
    add: (userData: CreateUserAttributes) => Promise<UserAttributes>;
    findUserByEmail: (email: string) => Promise<UserAttributes>;
    findById: (id: string) => Promise<UserAttributes>;
    update: (id: string, userData: UpdateUserAttributes) => Promise<UserAttributes>;
}
