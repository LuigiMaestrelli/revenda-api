import { CreateUserAttributes, UserWithAuthAttributes } from '@/domain/models/user/user';
import { IAddUserApplication } from '@/domain/usecases/user/user';
import { IAddUserRepository, IFindUserByEmailRepository } from '@/domain/repository/user/user';
import { Hasher } from '@/infra/interfaces/cryptography';
import { InvalidParamError } from '@/shared/errors';
import { IGenerateAuthApplication } from '@/domain/usecases/auth/authentication';

export class UserApplication implements IAddUserApplication {
    constructor(
        private readonly hasher: Hasher,
        private readonly addUserRepository: IAddUserRepository,
        private readonly findUserByEmailRepository: IFindUserByEmailRepository,
        private readonly authApplication: IGenerateAuthApplication
    ) {}

    async add(userData: CreateUserAttributes): Promise<UserWithAuthAttributes> {
        const userWithEmail = await this.findUserByEmailRepository.findUserByEmail(userData.email);

        if (userWithEmail) {
            throw new InvalidParamError('e-mail already in use');
        }

        const passwordOriginal = userData.password;
        userData.password = await this.hasher.hash(passwordOriginal);

        const user = await this.addUserRepository.add(userData);

        const authData = await this.authApplication.auth({ email: userData.email, password: passwordOriginal });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            token: authData.token,
            refreshToken: authData.refreshToken,
            expiresIn: authData.expiresIn
        };
    }
}
