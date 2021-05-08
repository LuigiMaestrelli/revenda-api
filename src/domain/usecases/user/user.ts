import {
    CreateUserAttributes,
    UserWithAuthAttributes,
    UpdateUserAttributes,
    UserAttributes
} from '@/domain/models/user/user';

export interface IAddUser {
    add: (userData: CreateUserAttributes) => Promise<UserWithAuthAttributes>;
}

export interface IUpdateUser {
    update: (id: string, userData: UpdateUserAttributes) => Promise<UserAttributes>;
}
