import { AuthenticationUseCase } from '@/application/usecases/auth/auth';
import { TokenPayload, AuthenticationResult } from '@/domain/models/auth/authentication';
import { IUserRepository } from '@/domain/repository/user/user';
import { ITokenSigner } from '@/infra/protocols/tokenSigner';
import { IHasher } from '@/infra/protocols/cryptography';
import { UnauthorizedError } from '@/shared/errors';
import { makeUserRepositoryStub } from '@test/utils/mocks/repository/user';
import { IAccessLogRepository } from '@/domain/repository/log/accessLog';
import { CreateAccessLogAttributes, AccessLogAttributes } from '@/domain/models/log/accessLog';

type SutTypes = {
    sut: AuthenticationUseCase;
    tokenSignerStub: ITokenSigner;
    hasherStub: IHasher;
    userRepositoryStub: IUserRepository;
    accessLogRepositoryStub: IAccessLogRepository;
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

const makeHasher = (): IHasher => {
    class HashCompareStub implements IHasher {
        async hash(value: string): Promise<string> {
            return 'hashed value';
        }

        async compare(value: string, hash: string): Promise<boolean> {
            return true;
        }
    }

    return new HashCompareStub();
};

const makeAccessLogRepository = (): IAccessLogRepository => {
    class AccessLogRepositoryStub implements IAccessLogRepository {
        async addAuthorized(accessData: CreateAccessLogAttributes): Promise<AccessLogAttributes> {
            return {
                id: 'valid uuid',
                authorized: true,
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            };
        }

        async addUnauthorized(accessData: CreateAccessLogAttributes): Promise<AccessLogAttributes> {
            return {
                id: 'valid uuid',
                authorized: false,
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            };
        }
    }

    return new AccessLogRepositoryStub();
};

const makeSut = (): SutTypes => {
    const tokenSignerStub = makeTokenSigner();
    const hasherStub = makeHasher();
    const userRepositoryStub = makeUserRepositoryStub();
    const accessLogRepositoryStub = makeAccessLogRepository();
    const sut = new AuthenticationUseCase(tokenSignerStub, hasherStub, userRepositoryStub, accessLogRepositoryStub);

    return {
        sut,
        tokenSignerStub,
        hasherStub,
        userRepositoryStub,
        accessLogRepositoryStub
    };
};

describe('Auth UseCase', () => {
    test('should call userRepository with correct values', async () => {
        const { sut, userRepositoryStub } = makeSut();

        const userRepositorySpy = jest.spyOn(userRepositoryStub, 'findUserByEmail');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto, {});

        expect(userRepositorySpy).toBeCalledWith('valid email');
    });

    test('should throw if userRepository throws', async () => {
        const { sut, userRepositoryStub } = makeSut();

        jest.spyOn(userRepositoryStub, 'findUserByEmail').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should throw if no user was found with requested e-mail', async () => {
        const { sut, userRepositoryStub } = makeSut();

        jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(new Promise(resolve => resolve(null)));

        const authDto = { email: 'invalid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new UnauthorizedError('Invalid e-mail or password'));
    });

    test('should throw if the password does not match', async () => {
        const { sut, hasherStub } = makeSut();

        jest.spyOn(hasherStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));

        const authDto = { email: 'valid email', password: 'invalid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new UnauthorizedError('Invalid e-mail or password'));
    });

    test('should throw if user is inactive', async () => {
        const { sut, userRepositoryStub } = makeSut();

        jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(
            new Promise(resolve =>
                resolve({
                    id: 'valid id',
                    email: 'valid email',
                    name: 'valid name',
                    password: 'xxx',
                    active: false
                })
            )
        );

        const authDto = { email: 'invalid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new UnauthorizedError('Invalid e-mail or password'));
    });

    test('should throw if tokenSigner throws', async () => {
        const { sut, tokenSignerStub } = makeSut();

        jest.spyOn(tokenSignerStub, 'sign').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should call tokenSigner with correct values', async () => {
        const { sut, tokenSignerStub } = makeSut();

        const tokenSignerSpy = jest.spyOn(tokenSignerStub, 'sign');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto, {});

        expect(tokenSignerSpy).toBeCalledWith({
            userId: 'valid id'
        });
    });

    test('should throw if hasher throws', async () => {
        const { sut, hasherStub } = makeSut();

        jest.spyOn(hasherStub, 'compare').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should call hasher with correct values', async () => {
        const { sut, hasherStub } = makeSut();

        const hasherSpy = jest.spyOn(hasherStub, 'compare');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto, {});

        expect(hasherSpy).toBeCalledWith('valid password', 'hashed password');
    });

    test('should call addUnauthorized access log if no user with e-mail was found', async () => {
        const { sut, userRepositoryStub, accessLogRepositoryStub } = makeSut();

        jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(new Promise(resolve => resolve(null)));
        const addUnauthorizedSpy = jest.spyOn(accessLogRepositoryStub, 'addUnauthorized');

        const authDto = { email: 'invalid email', password: 'valid password' };
        const networkAccessDto = {
            ip: 'valid ip',
            userAgent: 'valid useragent',
            hostName: 'valid hostname',
            origin: 'valid origin'
        };

        try {
            await sut.auth(authDto, networkAccessDto);
        } catch (e) {}

        expect(addUnauthorizedSpy).toBeCalledWith({
            ...networkAccessDto,
            email: 'invalid email',
            reason: 'E-mail not found'
        });
    });

    test('should call addUnauthorized access log if user is inactive', async () => {
        const { sut, userRepositoryStub, accessLogRepositoryStub } = makeSut();

        const addUnauthorizedSpy = jest.spyOn(accessLogRepositoryStub, 'addUnauthorized');
        jest.spyOn(userRepositoryStub, 'findUserByEmail').mockReturnValueOnce(
            new Promise(resolve =>
                resolve({
                    id: 'valid id',
                    email: 'valid email',
                    name: 'valid name',
                    password: 'xxx',
                    active: false
                })
            )
        );

        const authDto = { email: 'invalid email', password: 'valid password' };
        const networkAccessDto = {
            ip: 'valid ip',
            userAgent: 'valid useragent',
            hostName: 'valid hostname',
            origin: 'valid origin'
        };

        try {
            await sut.auth(authDto, networkAccessDto);
        } catch (e) {}

        expect(addUnauthorizedSpy).toBeCalledWith({
            ...networkAccessDto,
            email: 'invalid email',
            reason: 'Inactive user'
        });
    });

    test('should call addUnauthorized access log if password is invalid', async () => {
        const { sut, hasherStub, accessLogRepositoryStub } = makeSut();

        jest.spyOn(hasherStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
        const addUnauthorizedSpy = jest.spyOn(accessLogRepositoryStub, 'addUnauthorized');

        const authDto = { email: 'valid email', password: 'invalid password' };
        const networkAccessDto = {
            ip: 'valid ip',
            userAgent: 'valid useragent',
            hostName: 'valid hostname',
            origin: 'valid origin'
        };

        try {
            await sut.auth(authDto, networkAccessDto);
        } catch (e) {}

        expect(addUnauthorizedSpy).toBeCalledWith({
            ...networkAccessDto,
            email: 'valid email',
            reason: 'Invalid password'
        });
    });

    test('should call addAuthorized access log if valid data is sent', async () => {
        const { sut, accessLogRepositoryStub } = makeSut();

        const addAuthorizedSpy = jest.spyOn(accessLogRepositoryStub, 'addAuthorized');

        const authDto = { email: 'valid email', password: 'valid password' };
        const networkAccessDto = {
            ip: 'valid ip',
            userAgent: 'valid useragent',
            hostName: 'valid hostname',
            origin: 'valid origin'
        };

        await sut.auth(authDto, networkAccessDto);

        expect(addAuthorizedSpy).toBeCalledWith({
            ...networkAccessDto,
            email: 'valid email'
        });
    });
});
