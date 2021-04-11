import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IAddUserRepository } from '@/domain/usecases/user/addUser';
import { IdGenerator } from '@/infra/interfaces/idGenerator';
import UserModel from '@/infra/db/model/user';

export class UserRepository implements IAddUserRepository {
    constructor(private readonly idGenerator: IdGenerator) {}

    async add(userData: CreateUserAttributes): Promise<UserAttributes> {
        const id = await this.idGenerator.generate();

        const user = await UserModel.create({
            id,
            ...userData
        });

        return user;
    }
}
