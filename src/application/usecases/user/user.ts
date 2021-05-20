import {
    CreateUserAttributes,
    UpdateUserAttributes,
    UserAttributes,
    UserWithAuthAttributes
} from '@/domain/models/user/user';
import { IUserUseCase } from '@/domain/usecases/user/user';
import { IUserRepository } from '@/domain/repository/user/user';
import { IHasher } from '@/infra/protocols/cryptography';
import { InvalidParamError } from '@/shared/errors';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { NetworkAccessInfo } from '@/domain/models/auth/networkAccessInfo';

export class UserUseCase implements IUserUseCase {
    constructor(
        private readonly hasher: IHasher,
        private readonly userRepository: IUserRepository,
        private readonly generateAuthentication: IGenerateAuthentication
    ) {}

    async add(userData: CreateUserAttributes, networkAccessInfo: NetworkAccessInfo): Promise<UserWithAuthAttributes> {
        const userWithEmail = await this.userRepository.findUserByEmail(userData.email);
        if (userWithEmail) {
            throw new InvalidParamError('e-mail already in use');
        }

        const passwordOriginal = userData.password;
        userData.password = await this.hasher.hash(passwordOriginal);

        const user = await this.userRepository.add(userData);
        const authData = await this.generateAuthentication.auth(
            { email: userData.email, password: passwordOriginal },
            networkAccessInfo
        );

        return {
            user: user,
            auth: authData
        };
    }

    async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
        return await this.userRepository.update(id, userData);
    }

    async active(id: string): Promise<void> {
        await this.userRepository.update(id, { active: true });
    }

    async inactive(id: string): Promise<void> {
        await this.userRepository.update(id, { active: false });
    }
}
