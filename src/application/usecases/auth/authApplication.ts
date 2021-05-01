import { AutenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';
import { IFindUserByEmailRepository } from '@/domain/repository/user/user';
import { IGenerateAuthApplication } from '@/domain/usecases/auth/authentication';
import { IHashCompare } from '@/infra/protocols/cryptography';
import { ITokenSigner } from '@/infra/protocols/tokenSigner';
import { UnauthorizedError } from '@/shared/errors';

export class AuthApplication implements IGenerateAuthApplication {
    constructor(
        private readonly tokenSigner: ITokenSigner,
        private readonly hasherCompare: IHashCompare,
        private readonly findUserByEmailRepository: IFindUserByEmailRepository
    ) {}

    async auth(autentication: AutenticationAttributes): Promise<AuthenticationResult> {
        const user = await this.findUserByEmailRepository.findUserByEmail(autentication.email);
        if (!user) {
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
