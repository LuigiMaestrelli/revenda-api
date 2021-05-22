import { AuthenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';
import { NetworkAccessInfo } from '@/domain/models/auth/networkAccessInfo';
import { IAccessLogRepository } from '@/domain/repository/log/accessLog';
import { IUserRepository } from '@/domain/repository/user/user';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { IHasher } from '@/infra/protocols/cryptography';
import { ITokenSigner } from '@/infra/protocols/tokenSigner';
import { UnauthorizedError } from '@/shared/errors';

export class AuthenticationUseCase implements IGenerateAuthentication {
    constructor(
        private readonly tokenSigner: ITokenSigner,
        private readonly hasher: IHasher,
        private readonly userRepository: IUserRepository,
        private readonly accessLogRepository: IAccessLogRepository
    ) {}

    async auth(
        autentication: AuthenticationAttributes,
        networkAccessInfo: NetworkAccessInfo
    ): Promise<AuthenticationResult> {
        const user = await this.userRepository.findUserByEmail(autentication.email);
        if (!user) {
            await this.accessLogRepository.addUnauthorized({
                ...networkAccessInfo,
                email: autentication.email,
                reason: 'E-mail not found'
            });
            throw new UnauthorizedError('Invalid e-mail or password');
        }

        if (!user.active) {
            await this.accessLogRepository.addUnauthorized({
                ...networkAccessInfo,
                email: autentication.email,
                reason: 'Inactive user'
            });
            throw new UnauthorizedError('Invalid e-mail or password');
        }

        const isValid = await this.hasher.compare(autentication.password, user.password);
        if (!isValid) {
            await this.accessLogRepository.addUnauthorized({
                ...networkAccessInfo,
                email: autentication.email,
                reason: 'Invalid password'
            });
            throw new UnauthorizedError('Invalid e-mail or password');
        }

        await this.accessLogRepository.addAuthorized({
            ...networkAccessInfo,
            email: autentication.email
        });

        return await this.tokenSigner.sign({
            userId: user.id
        });
    }
}
