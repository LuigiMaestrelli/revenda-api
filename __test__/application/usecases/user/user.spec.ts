import { IHasher } from '@/infra/protocols/cryptography';
import { UserUseCase } from '@/application/usecases/user/user';
import { CreateUserAttributes, UpdateUserAttributes, UserAttributes } from '@/domain/models/user/User';
import { IUserRepository } from '@/domain/repository/user/user';
import { InvalidParamError } from '@/shared/errors';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { AuthenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';

type SutTypes = {
    hasherStub: IHasher;
    userRepositoryStub: IUserRepository;
    gerenerateAuthenticationStub: IGenerateAuthentication;
    sut: UserUseCase;
};

const makeValidCreateUserAttributes = (): CreateUserAttributes => {
    return {
        name: 'valid name',
        email: 'valid e-mail',
        password: 'valid password'
    };
};

const makeHasher = (): IHasher => {
    class HasherStub implements IHasher {
        async hash(value: string): Promise<string> {
            return 'hashed password';
        }
    }

    return new HasherStub();
};

const makeUserRepository = (): IUserRepository => {
    class UserRepositoryStub implements IUserRepository {
        async findUserByEmail(email: string): Promise<UserAttributes> {
            return null;
        }

        async findById(id: string): Promise<UserAttributes> {
            throw new Error('not implemented');
        }

        async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
            const currentData = {
                id: id,
                email: 'valid e-mail',
                password: 'hashed password',
                active: true,
                name: 'valid name'
            };

            return {
                ...currentData,
                ...userData
            };
        }

        async add(accountData: CreateUserAttributes): Promise<UserAttributes> {
            return {
                id: 'valid id',
                email: 'valid e-mail',
                name: 'valid name',
                password: 'hashed password',
                active: true
            };
        }
    }

    return new UserRepositoryStub();
};

const makeGerenerateAuthentication = (): IGenerateAuthentication => {
    class GerenerateAuthenticationStub implements IGenerateAuthentication {
        async auth(autentication: AuthenticationAttributes): Promise<AuthenticationResult> {
            return {
                token: 'valid token',
                refreshToken: 'valid refreshtoken',
                expiresIn: 100
            };
        }
    }

    return new GerenerateAuthenticationStub();
};

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher();
    const userRepositoryStub = makeUserRepository();
    const gerenerateAuthenticationStub = makeGerenerateAuthentication();

    const sut = new UserUseCase(hasherStub, userRepositoryStub, gerenerateAuthenticationStub);

    return {
        hasherStub,
        gerenerateAuthenticationStub,
        userRepositoryStub,
        sut
    };
};

describe('User UseCase', () => {
    describe('Add user', () => {
        test('should call Encrypter with correct value', async () => {
            const { sut, hasherStub } = makeSut();
            const encryptSpy = jest.spyOn(hasherStub, 'hash');

            const accountData = makeValidCreateUserAttributes();

            await sut.add(accountData);

            expect(encryptSpy).toHaveBeenCalledWith('valid password');
        });

        test('should throw if Encrypter throws', async () => {
            const { sut, hasherStub } = makeSut();

            jest.spyOn(hasherStub, 'hash').mockImplementation(() => {
                throw new Error('Test throw');
            });

            const accountData = makeValidCreateUserAttributes();

            const addPromise = sut.add(accountData);
            await expect(addPromise).rejects.toThrow();
        });

        test('should call AddUserRepository with correct values', async () => {
            const { sut, userRepositoryStub } = makeSut();
            const addUserRepositorySpy = jest.spyOn(userRepositoryStub, 'add');

            const userData = makeValidCreateUserAttributes();

            await sut.add(userData);

            expect(addUserRepositorySpy).toHaveBeenCalledWith({
                name: 'valid name',
                email: 'valid e-mail',
                password: 'hashed password'
            });
        });

        test('should return created user data with authentication data', async () => {
            const { sut } = makeSut();
            const userData = makeValidCreateUserAttributes();

            const user = await sut.add(userData);

            expect(user).toEqual({
                user: {
                    id: 'valid id',
                    name: 'valid name',
                    email: 'valid e-mail',
                    password: 'hashed password',
                    active: true
                },
                auth: {
                    token: 'valid token',
                    refreshToken: 'valid refreshtoken',
                    expiresIn: 100
                }
            });
        });

        test('should throw if AddUserRepository throws', async () => {
            const { sut, userRepositoryStub } = makeSut();

            jest.spyOn(userRepositoryStub, 'add').mockImplementation(() => {
                throw new Error('Test throw');
            });

            const accountData = makeValidCreateUserAttributes();

            const addPromise = sut.add(accountData);
            await expect(addPromise).rejects.toThrow();
        });

        test('should throw if FindUserByEmailRepository throws', async () => {
            const { sut, userRepositoryStub } = makeSut();

            jest.spyOn(userRepositoryStub, 'findUserByEmail').mockImplementation(() => {
                throw new Error('Test throw');
            });

            const accountData = makeValidCreateUserAttributes();

            const addPromise = sut.add(accountData);
            await expect(addPromise).rejects.toThrow();
        });

        test('should call FindUserByEmailRepository with correct value', async () => {
            const { sut, userRepositoryStub } = makeSut();
            const findUserByEmailRepositorySpy = jest.spyOn(userRepositoryStub, 'findUserByEmail');

            const userData = makeValidCreateUserAttributes();

            await sut.add(userData);

            expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith('valid e-mail');
        });

        test('should throw if e-mail already exists', async () => {
            const { sut, userRepositoryStub } = makeSut();
            jest.spyOn(userRepositoryStub, 'findUserByEmail').mockImplementationOnce(async () => {
                return await new Promise(resolve =>
                    resolve({
                        id: 'valid id',
                        email: 'valid e-mail',
                        name: 'valid name',
                        password: 'hashed password',
                        active: true
                    })
                );
            });

            const userData = makeValidCreateUserAttributes();

            const addPromise = sut.add(userData);
            await expect(addPromise).rejects.toThrow(new InvalidParamError('e-mail already in use'));
        });

        test('should call GerenerateAuthentication with correct values', async () => {
            const { sut, gerenerateAuthenticationStub } = makeSut();
            const gerenerateAuthenticationSpy = jest.spyOn(gerenerateAuthenticationStub, 'auth');

            const userData = makeValidCreateUserAttributes();

            await sut.add(userData);

            expect(gerenerateAuthenticationSpy).toHaveBeenCalledWith({
                email: 'valid e-mail',
                password: 'valid password'
            });
        });

        test('should throw if GerenerateAuthentication throws', async () => {
            const { sut, gerenerateAuthenticationStub } = makeSut();
            jest.spyOn(gerenerateAuthenticationStub, 'auth').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const userData = makeValidCreateUserAttributes();

            const addPromise = sut.add(userData);

            await expect(addPromise).rejects.toThrow(new Error('Test throw'));
        });
    });

    describe('Update user', () => {
        test('should call UpdateUserRepository with correct values', async () => {
            const { sut, userRepositoryStub } = makeSut();
            const updateUserRepositorySpy = jest.spyOn(userRepositoryStub, 'update');

            const userData = { name: 'new name' };

            await sut.update('valid id', userData);

            expect(updateUserRepositorySpy).toHaveBeenCalledWith('valid id', {
                name: 'new name'
            });
        });

        test('should throw if UpdateUserRepository throws', async () => {
            const { sut, userRepositoryStub } = makeSut();
            const userData = { name: 'new name' };

            jest.spyOn(userRepositoryStub, 'update').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const updatePromise = sut.update('valid id', userData);

            await expect(updatePromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should return updated user data when sending a new name', async () => {
            const { sut } = makeSut();
            const userData = { name: 'new name' };

            const user = await sut.update('valid id', userData);

            expect(user).toEqual({
                id: 'valid id',
                name: 'new name',
                email: 'valid e-mail',
                password: 'hashed password',
                active: true
            });
        });

        test('should return updated user data when sending a new password', async () => {
            const { sut } = makeSut();
            const userData = { password: 'new password' };

            const user = await sut.update('valid id', userData);

            expect(user).toEqual({
                id: 'valid id',
                name: 'valid name',
                email: 'valid e-mail',
                password: 'new password',
                active: true
            });
        });

        test('should return updated user data when sending active', async () => {
            const { sut } = makeSut();
            const userData = { active: false };

            const user = await sut.update('valid id', userData);

            expect(user).toEqual({
                id: 'valid id',
                name: 'valid name',
                email: 'valid e-mail',
                password: 'hashed password',
                active: false
            });
        });
    });
});
