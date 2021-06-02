import {
    CreateUserAttributes,
    UpdateUserAttributes,
    UpdateUserPassword,
    UserAttributes,
    UserWithAuthAttributes
} from '@/domain/models/user/user';
import { IUserUseCase } from '@/domain/usecases/user/user';

export function makeUserUseCaseStub(): IUserUseCase {
    class UserUseCaseStub implements IUserUseCase {
        async add(user: CreateUserAttributes): Promise<UserWithAuthAttributes> {
            return {
                user: {
                    id: 'valid_id',
                    name: 'valid name',
                    email: 'valid_email@email.com',
                    password: 'hashed password',
                    active: true
                },
                auth: {
                    token: 'valid token',
                    refreshToken: 'valid refreshtoken',
                    expiresIn: 100
                }
            };
        }

        async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
            return {
                id: id,
                name: 'valid name',
                email: 'valid email',
                password: 'hashed password',
                active: true,
                ...userData
            };
        }

        async active(id: string): Promise<void> {}

        async inactive(id: string): Promise<void> {}

        async changePassword(id: string, passwordData: UpdateUserPassword): Promise<void> {}
    }

    return new UserUseCaseStub();
}
