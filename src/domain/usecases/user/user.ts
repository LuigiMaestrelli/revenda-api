import { NetworkAccessInfo } from '@/domain/models/auth/networkAccessInfo';
import {
    CreateUserAttributes,
    UserWithAuthAttributes,
    UpdateUserAttributes,
    UserAttributes,
    UpdateUserPassword
} from '@/domain/models/user/user';

export interface IUserUseCase {
    add: (userData: CreateUserAttributes, networkAccessInfo: NetworkAccessInfo) => Promise<UserWithAuthAttributes>;
    update: (id: string, userData: UpdateUserAttributes) => Promise<UserAttributes>;
    active: (id: string) => Promise<void>;
    inactive: (id: string) => Promise<void>;
    changePassword: (id: string, passwordData: UpdateUserPassword) => Promise<void>;
}
