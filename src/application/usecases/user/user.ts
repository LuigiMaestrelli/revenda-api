import {
    CreateUserAttributes,
    UpdateUserAttributes,
    UpdateUserPassword,
    UserAttributes,
    UserWithAuthAttributes
} from '@/domain/models/user/user';
import { IUserUseCase } from '@/domain/usecases/user/user';
import { IUserRepository } from '@/domain/repository/user/user';
import { IHasher } from '@/infra/protocols/cryptography';
import { ForbiddenError, InvalidParamError } from '@/shared/errors';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { NetworkAccessInfo } from '@/domain/models/auth/networkAccessInfo';
import { NotFoundError } from '@/shared/errors/notFoundError';

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

    async changePassword(id: string, passwordData: UpdateUserPassword): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        const isValid = await this.hasher.compare(passwordData.currentPassword, user.password);
        if (!isValid) {
            throw new ForbiddenError('Password does not match');
        }

        const hashedPassword = await this.hasher.hash(passwordData.newPassword);
        await this.update(id, { password: hashedPassword });
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
