import {
    CreateUserAttributes,
    UserWithAuthAttributes,
    UpdateUserAttributes,
    UserAttributes
} from '@/domain/models/user/user';

export interface IUserUseCase {
    add: (userData: CreateUserAttributes) => Promise<UserWithAuthAttributes>;
    update: (id: string, userData: UpdateUserAttributes) => Promise<UserAttributes>;
}
