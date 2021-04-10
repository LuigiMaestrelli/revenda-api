import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IAddUserApplication, IAddUserRepository } from '@/domain/usecases/user/addUser';
import { Encrypter } from '@/application/interfaces/encrypter';

export class UserApplication implements IAddUserApplication {
    constructor(private readonly encrypter: Encrypter, private readonly addUserRepository: IAddUserRepository) {}

    async add(userData: CreateUserAttributes): Promise<UserAttributes> {
        userData.password = await this.encrypter.encrypt(userData.password);

        const user = await this.addUserRepository.add(userData);
        return user;
    }
}
