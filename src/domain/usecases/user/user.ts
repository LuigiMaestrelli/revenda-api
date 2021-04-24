import { CreateUserAttributes, UserWithAuthAttributes } from '@/domain/models/user/user';

export interface IAddUserApplication {
    add: (userData: CreateUserAttributes) => Promise<UserWithAuthAttributes>;
}
