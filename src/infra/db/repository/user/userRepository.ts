import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IAddUserRepository, IFindUserByEmailRepository } from '@/domain/repository/user/user';
import { IdGenerator } from '@/infra/interfaces/idGenerator';
import UserModel from '@/infra/db/model/user/userModel';

export class UserRepository implements IAddUserRepository, IFindUserByEmailRepository {
    constructor(private readonly idGenerator: IdGenerator) {}

    async add(userData: CreateUserAttributes): Promise<UserAttributes> {
        const id = await this.idGenerator.generate();

        return await UserModel.create({
            id,
            ...userData
        });
    }

    async findUserByEmail(email: string): Promise<UserAttributes | null> {
        return await UserModel.findOne({ where: { email } });
    }
}
