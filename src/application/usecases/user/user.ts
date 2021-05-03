import { CreateUserAttributes, UserWithAuthAttributes } from '@/domain/models/user/user';
import { IAddUser } from '@/domain/usecases/user/user';
import { IAddUserRepository, IFindUserByEmailRepository } from '@/domain/repository/user/user';
import { IHasher } from '@/infra/protocols/cryptography';
import { InvalidParamError } from '@/shared/errors';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';

export class UserUseCase implements IAddUser {
    constructor(
        private readonly hasher: IHasher,
        private readonly addUserRepository: IAddUserRepository,
        private readonly findUserByEmailRepository: IFindUserByEmailRepository,
        private readonly generateAuthentication: IGenerateAuthentication
    ) {}

    async add(userData: CreateUserAttributes): Promise<UserWithAuthAttributes> {
        const userWithEmail = await this.findUserByEmailRepository.findUserByEmail(userData.email);
        if (userWithEmail) {
            throw new InvalidParamError('e-mail already in use');
        }

        const passwordOriginal = userData.password;
        userData.password = await this.hasher.hash(passwordOriginal);

        const user = await this.addUserRepository.add(userData);
        const authData = await this.generateAuthentication.auth({ email: userData.email, password: passwordOriginal });

        return {
            user: user,
            auth: authData
        };
    }
}
