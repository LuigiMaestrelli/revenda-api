import { AuthenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';
import { IUserRepository } from '@/domain/repository/user/user';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { IHashCompare } from '@/infra/protocols/cryptography';
import { ITokenSigner } from '@/infra/protocols/tokenSigner';
import { UnauthorizedError } from '@/shared/errors';

export class AuthenticationUseCase implements IGenerateAuthentication {
    constructor(
        private readonly tokenSigner: ITokenSigner,
        private readonly hasherCompare: IHashCompare,
        private readonly userRepository: IUserRepository
    ) {}

    async auth(autentication: AuthenticationAttributes): Promise<AuthenticationResult> {
        const user = await this.userRepository.findUserByEmail(autentication.email);
        if (!user) {
            throw new UnauthorizedError('Invalid e-mail or password');
        }

        if (!user.active) {
            throw new UnauthorizedError('Invalid e-mail or password');
        }

        const isValid = await this.hasherCompare.compare(autentication.password, user.password);
        if (!isValid) {
            throw new UnauthorizedError('Invalid e-mail or password');
        }

        return await this.tokenSigner.sign({
            userId: user.id
        });
    }
}
