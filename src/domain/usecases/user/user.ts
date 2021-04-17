import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';

export interface IAddUserApplication {
    add: (userData: CreateUserAttributes) => Promise<UserAttributes>;
}
