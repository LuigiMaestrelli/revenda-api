import { UserModel } from '@/domain/models/user/User';
import { IAddUserApplication, AddUserModel } from '@/domain/usecases/user/addUser';
import { Encrypter } from '@/application/interfaces/encrypter';

export class UserApplication implements IAddUserApplication {
    constructor(private readonly encrypter: Encrypter) {}

    async add(accountData: AddUserModel): Promise<UserModel | null> {
        await this.encrypter.encrypt(accountData.password);
        return null;
    }
}
