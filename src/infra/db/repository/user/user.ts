import { CreateUserAttributes, UpdateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IUserRepository } from '@/domain/repository/user/user';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { NotFoundError } from '@/shared/errors/notFoundError';
import UserModel from '@/infra/db/model/user/userModel';

export class UserRepository implements IUserRepository {
    constructor(private readonly idGenerator: IIdGenerator) {}

    async add(userData: CreateUserAttributes): Promise<UserAttributes> {
        const id = await this.idGenerator.generate();

        return await UserModel.create({
            id,
            ...userData
        });
    }

    async findUserByEmail(email: string): Promise<UserAttributes> {
        return await UserModel.findOne({ where: { email } });
    }

    async findById(id: string): Promise<UserAttributes> {
        return await UserModel.findByPk(id);
    }

    async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
        const item = await UserModel.findByPk(id);
        if (!item) {
            throw new NotFoundError('Data not found');
        }

        return await item.update(userData);
    }
}
