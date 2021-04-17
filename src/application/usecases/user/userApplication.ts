import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IAddUserApplication } from '@/domain/usecases/user/user';
import { IAddUserRepository } from '@/domain/repository/user/user';
import { Hasher } from '@/infra/interfaces/cryptography';

export class UserApplication implements IAddUserApplication {
    constructor(private readonly hasher: Hasher, private readonly addUserRepository: IAddUserRepository) {}

    async add(userData: CreateUserAttributes): Promise<UserAttributes> {
        userData.password = await this.hasher.hash(userData.password);

        return await this.addUserRepository.add(userData);
    }
}
