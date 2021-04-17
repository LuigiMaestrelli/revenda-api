import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IAddUserApplication } from '@/domain/usecases/user/user';
import { IAddUserRepository, IFindUserByEmailRepository } from '@/domain/repository/user/user';
import { Hasher } from '@/infra/interfaces/cryptography';
import { InvalidParamError } from '@/shared/errors';

export class UserApplication implements IAddUserApplication {
    constructor(
        private readonly hasher: Hasher,
        private readonly addUserRepository: IAddUserRepository,
        private readonly findUserByEmail: IFindUserByEmailRepository
    ) {}

    async add(userData: CreateUserAttributes): Promise<UserAttributes> {
        const userWithEmail = await this.findUserByEmail.findUserByEmail(userData.email);

        if (userWithEmail) {
            throw new InvalidParamError('e-mail already in use');
        }

        userData.password = await this.hasher.hash(userData.password);

        return await this.addUserRepository.add(userData);
    }
}
