import { CreateUserAttributes, UpdateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IUserRepository } from '@/domain/repository/user/user';

export function makeUserRepository(): IUserRepository {
    class UserRepositoryStub implements IUserRepository {
        async add(userData: CreateUserAttributes): Promise<UserAttributes> {
            return {
                id: 'valid id',
                email: 'valid e-mail',
                name: 'valid name',
                password: 'hashed password',
                active: true
            };
        }

        async findUserByEmail(email: string): Promise<UserAttributes> {
            return {
                id: 'valid id',
                name: 'valid name',
                email,
                password: 'hashed password',
                active: true
            };
        }

        async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
            const currentData = {
                id: id,
                email: 'valid e-mail',
                password: 'hashed password',
                active: true,
                name: 'valid name'
            };

            return {
                ...currentData,
                ...userData
            };
        }

        async findById(id: string): Promise<UserAttributes> {
            return {
                id: id,
                name: 'valid name',
                email: 'valid email',
                password: 'hashed password',
                active: true
            };
        }
    }

    return new UserRepositoryStub();
}
