import { AuthenticationUseCase } from '@/application/usecases/auth/auth';
import { TokenPayload, AuthenticationResult } from '@/domain/models/auth/authentication';
import { IUserRepository } from '@/domain/repository/user/user';
import { ITokenSigner } from '@/infra/protocols/tokenSigner';
import { IHashCompare } from '@/infra/protocols/cryptography';
import { UnauthorizedError } from '@/shared/errors';
import { makeUserRepositoryStub } from '@test/utils/mocks/repository/user';
import { IAccessLogRepository } from '@/domain/repository/log/accessLog';
import { CreateAccessLogAttributes, AccessLogAttributes } from '@/domain/models/log/accessLog';

type SutTypes = {
    sut: AuthenticationUseCase;
    tokenSigner: ITokenSigner;
    hasherCompare: IHashCompare;
    userRepository: IUserRepository;
    accessLogRepository: IAccessLogRepository;
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
    const tokenSigner = makeTokenSigner();
    const hasherCompare = makeHashCompare();
    const userRepository = makeUserRepositoryStub();
    const accessLogRepository = makeAccessLogRepository();
    const sut = new AuthenticationUseCase(tokenSigner, hasherCompare, userRepository, accessLogRepository);

    return {
        sut,
        tokenSigner,
        hasherCompare,
        userRepository,
        accessLogRepository
    };
};

describe('Auth UseCase', () => {
    test('should call userRepository with correct values', async () => {
        const { sut, userRepository } = makeSut();

        const userRepositorySpy = jest.spyOn(userRepository, 'findUserByEmail');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto, {});

        expect(userRepositorySpy).toBeCalledWith('valid email');
    });

    test('should throw if userRepository throws', async () => {
        const { sut, userRepository } = makeSut();

        jest.spyOn(userRepository, 'findUserByEmail').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should throw if no user was found with requested e-mail', async () => {
        const { sut, userRepository } = makeSut();

        jest.spyOn(userRepository, 'findUserByEmail').mockReturnValueOnce(new Promise(resolve => resolve(null)));

        const authDto = { email: 'invalid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new UnauthorizedError('Invalid e-mail or password'));
    });

    test('should throw if the password does not match', async () => {
        const { sut, hasherCompare } = makeSut();

        jest.spyOn(hasherCompare, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));

        const authDto = { email: 'valid email', password: 'invalid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new UnauthorizedError('Invalid e-mail or password'));
    });

    test('should throw if user is inactive', async () => {
        const { sut, userRepository } = makeSut();

        jest.spyOn(userRepository, 'findUserByEmail').mockReturnValueOnce(
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
        const { sut, tokenSigner } = makeSut();

        jest.spyOn(tokenSigner, 'sign').mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        const authDto = { email: 'valid email', password: 'valid password' };
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should call tokenSigner with correct values', async () => {
        const { sut, tokenSigner } = makeSut();

        const tokenSignerSpy = jest.spyOn(tokenSigner, 'sign');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto, {});

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
        const authPromise = sut.auth(authDto, {});

        await expect(authPromise).rejects.toThrow(new Error('Test error'));
    });

    test('should call hasherCompare with correct values', async () => {
        const { sut, hasherCompare } = makeSut();

        const hasherCompareSpy = jest.spyOn(hasherCompare, 'compare');

        const authDto = { email: 'valid email', password: 'valid password' };
        await sut.auth(authDto, {});

        expect(hasherCompareSpy).toBeCalledWith('valid password', 'hashed password');
    });

    test('should call addUnauthorized access log if no user with e-mail was found', async () => {
        const { sut, userRepository, accessLogRepository } = makeSut();

        jest.spyOn(userRepository, 'findUserByEmail').mockReturnValueOnce(new Promise(resolve => resolve(null)));
        const addUnauthorizedSpy = jest.spyOn(accessLogRepository, 'addUnauthorized');

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
        const { sut, userRepository, accessLogRepository } = makeSut();

        const addUnauthorizedSpy = jest.spyOn(accessLogRepository, 'addUnauthorized');
        jest.spyOn(userRepository, 'findUserByEmail').mockReturnValueOnce(
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
        const { sut, hasherCompare, accessLogRepository } = makeSut();

        jest.spyOn(hasherCompare, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
        const addUnauthorizedSpy = jest.spyOn(accessLogRepository, 'addUnauthorized');

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
        const { sut, accessLogRepository } = makeSut();

        const addAuthorizedSpy = jest.spyOn(accessLogRepository, 'addAuthorized');

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
