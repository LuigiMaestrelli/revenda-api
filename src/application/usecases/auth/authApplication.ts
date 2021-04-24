import { AutenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';
import { IFindUserByEmailRepository } from '@/domain/repository/user/user';
import { IGenerateAuthApplication } from '@/domain/usecases/auth/authentication';
import { HashCompare } from '@/infra/interfaces/cryptography';
import { TokenSigner } from '@/infra/interfaces/tokenSigner';
import { InvalidParamError } from '@/shared/errors';

export class AuthApplication implements IGenerateAuthApplication {
    constructor(
        private readonly tokenSigner: TokenSigner,
        private readonly hasherCompare: HashCompare,
        private readonly findUserByEmailRepository: IFindUserByEmailRepository
    ) {}

    async auth(autentication: AutenticationAttributes): Promise<AuthenticationResult> {
        const user = await this.findUserByEmailRepository.findUserByEmail(autentication.email);

        if (!user) {
            throw new InvalidParamError('Invalid e-mail or password');
        }

        const isValid = await this.hasherCompare.compare(autentication.password, user.password);
        if (!isValid) {
            throw new InvalidParamError('Invalid e-mail or password');
        }

        return await this.tokenSigner.sign({
            userId: user.id
        });
    }
}
