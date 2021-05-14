import { AuthenticationUseCase } from '@/application/usecases/auth/auth';
import { TokenPayload, AuthenticationResult } from '@/domain/models/auth/authentication';
import { CreateUserAttributes, UpdateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IUserRepository } from '@/domain/repository/user/user';
import { ITokenSigner } from '@/infra/protocols/tokenSigner';
import { IHashCompare } from '@/infra/protocols/cryptography';
import { UnauthorizedError } from '@/shared/errors';

type SutTypes = {
    sut: AuthenticationUseCase;
    tokenSigner: ITokenSigner;
    hasherCompare: IHashCompare;
    userRepository: IUserRepository;
};

const makeTokenSigner = (): ITokenSigner => {
    class TokenSignerStub implements ITokenSigner {
        async sign(payload: TokenPayload): Promise<AuthenticationResult> {
            return {
                token: 'valid token',
                refreshToken: 'valid refreshtoken',
                expiresIn: 10
            };
        }
    }

    return new TokenSignerStub();
};

const makeHashCompare = (): IHashCompare => {
    class HashCompareStub implements IHashCompare {
        async compare(value: string, hash: string): Promise<boolean> {
            return true;
        }
    }

    return new HashCompareStub();
};

const makeUserRepository = (): IUserRepository => {
    class UserRepositoryStub implements IUserRepository {
        async add(userData: CreateUserAttributes): Promise<UserAttributes> {
            throw new Error('not implemented');
        }

        async findById(id: string): Promise<UserAttributes> {
            throw new Error('not implemented');
        }

        async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
            throw new Error('not implemented');
        }

        async findUserByEmail(email: string): Promise<UserAttributes | null> {
            return {
                id: 'valid id',
                email: 'valid email',
                name: 'valid name',
                password: 'password hash',
                active: true
            };
        }
    }

    return new UserRepositoryStub();
};

const makeSut = (): SutTypes => {
    const tokenSigner = makeTokenSigner();
    const hasherCompare = makeHashCompare();
    const userRepository = makeUserRepository();
    const sut = new AuthenticationUseCase(tokenSigner, hasherCompare, userRepository);

    return {
        sut,
        tokenSigner,
        hasherCompare,
        userRepository
    };
};

describe('Auth UseCase', () => {
    test('should call userRepository with correct values', async () => {
        const { sut, userRepository } = makeSut();

        const userRepositorySpy = jest.spyOn(userRepository, 'findUserByEmail');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto);

        expect(userRepositorySpy).toBeCalledWith('valid email');
    });

    test('should throw if userRepository throws', async () => {
        const { sut, userRepository } = makeSut();

        jest.spyOn(userRepository, 'findUserByEmail').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto);

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should throw if no user was found with requested e-mail', async () => {
        const { sut, userRepository } = makeSut();

        jest.spyOn(userRepository, 'findUserByEmail').mockReturnValueOnce(new Promise(resolve => resolve(null)));

        const authDto = { email: 'invalid email', password: 'valid password' };
        const authPromise = sut.auth(authDto);

        await expect(authPromise).rejects.toThrow(new UnauthorizedError('Invalid e-mail or password'));
    });

    test('should throw if tokenSigner throws', async () => {
        const { sut, tokenSigner } = makeSut();

        jest.spyOn(tokenSigner, 'sign').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto);

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should call tokenSigner with correct values', async () => {
        const { sut, tokenSigner } = makeSut();

        const tokenSignerSpy = jest.spyOn(tokenSigner, 'sign');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto);

        expect(tokenSignerSpy).toBeCalledWith({
            userId: 'valid id'
        });
    });

    test('should throw if hasherCompare throws', async () => {
        const { sut, hasherCompare } = makeSut();

        jest.spyOn(hasherCompare, 'compare').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto);

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should call hasherCompare with correct values', async () => {
        const { sut, hasherCompare } = makeSut();

        const hasherCompareSpy = jest.spyOn(hasherCompare, 'compare');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto);

        expect(hasherCompareSpy).toBeCalledWith('valid password', 'password hash');
    });

    test('should throw if the password is wrong', async () => {
        const { sut, hasherCompare } = makeSut();

        jest.spyOn(hasherCompare, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));

        const authDto = { email: 'valid email', password: 'invalid password' };
        const authPromise = sut.auth(authDto);

        await expect(authPromise).rejects.toThrow(new UnauthorizedError('Invalid e-mail or password'));
    });
});
