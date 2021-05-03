import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IAddUserRepository, IFindUserByEmailRepository, IFindUserByIdRepository } from '@/domain/repository/user/user';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import UserModel from '@/infra/db/model/user/userModel';

export class UserRepository implements IAddUserRepository, IFindUserByEmailRepository, IFindUserByIdRepository {
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
}
