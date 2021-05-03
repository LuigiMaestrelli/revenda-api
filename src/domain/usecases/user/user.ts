import { CreateUserAttributes, UserWithAuthAttributes } from '@/domain/models/user/user';

export interface IAddUser {
    add: (userData: CreateUserAttributes) => Promise<UserWithAuthAttributes>;
}
