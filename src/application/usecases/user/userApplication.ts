import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IAddUserApplication, IAddUserRepository } from '@/domain/usecases/user/addUser';
import { Hasher } from '@/application/interfaces/cryptography';

export class UserApplication implements IAddUserApplication {
    constructor(private readonly hasher: Hasher, private readonly addUserRepository: IAddUserRepository) {}

    async add(userData: CreateUserAttributes): Promise<UserAttributes> {
        userData.password = await this.hasher.hash(userData.password);

        const user = await this.addUserRepository.add(userData);
        return user;
    }
}
