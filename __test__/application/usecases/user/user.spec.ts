import { IHasher } from '@/infra/protocols/cryptography';
import { UserUseCase } from '@/application/usecases/user/user';
import { CreateUserAttributes, UpdateUserAttributes, UserAttributes } from '@/domain/models/user/User';
import { IAddUserRepository, IFindUserByEmailRepository, IUpdateUserRepository } from '@/domain/repository/user/user';
import { InvalidParamError } from '@/shared/errors';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { AutenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';

type SutTypes = {
    hasherStub: IHasher;
    addUserRepositoryStub: IAddUserRepository;
    findUserByEmailRepositoryStub: IFindUserByEmailRepository;
    gerenerateAuthenticationStub: IGenerateAuthentication;
    updateUserRepositoryStub: IUpdateUserRepository;
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

const makeAddUserRepository = (): IAddUserRepository => {
    class AddUserRepositoryStub implements IAddUserRepository {
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

    return new AddUserRepositoryStub();
};

const makeFindUserByEmailRepository = (): IFindUserByEmailRepository => {
    class FindUserByEmailRepositoryStub implements IFindUserByEmailRepository {
        async findUserByEmail(email: string): Promise<UserAttributes | null> {
            return null;
        }
    }

    return new FindUserByEmailRepositoryStub();
};

const makeGerenerateAuthentication = (): IGenerateAuthentication => {
    class GerenerateAuthenticationStub implements IGenerateAuthentication {
        async auth(autentication: AutenticationAttributes): Promise<AuthenticationResult> {
            return {
                token: 'valid token',
                refreshToken: 'valid refreshtoken',
                expiresIn: 100
            };
        }
    }

    return new GerenerateAuthenticationStub();
};

const makeUpdateUserRepository = (): IUpdateUserRepository => {
    class UpdateUserRepositoryStub implements IUpdateUserRepository {
        async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
            return {
                id: id,
                email: 'valid e-mail',
                password: 'hashed password',
                active: true,
                ...userData
            };
        }
    }

    return new UpdateUserRepositoryStub();
};

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher();
    const addUserRepositoryStub = makeAddUserRepository();
    const findUserByEmailRepositoryStub = makeFindUserByEmailRepository();
    const updateUserRepositoryStub = makeUpdateUserRepository();
    const gerenerateAuthenticationStub = makeGerenerateAuthentication();

    const sut = new UserUseCase(
        hasherStub,
        addUserRepositoryStub,
        findUserByEmailRepositoryStub,
        gerenerateAuthenticationStub,
        updateUserRepositoryStub
    );

    return {
        hasherStub,
        addUserRepositoryStub,
        findUserByEmailRepositoryStub,
        gerenerateAuthenticationStub,
        updateUserRepositoryStub,
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
            const { sut, addUserRepositoryStub } = makeSut();
            const addUserRepositorySpy = jest.spyOn(addUserRepositoryStub, 'add');

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
            const { sut, addUserRepositoryStub } = makeSut();

            jest.spyOn(addUserRepositoryStub, 'add').mockImplementation(() => {
                throw new Error('Test throw');
            });

            const accountData = makeValidCreateUserAttributes();

            const addPromise = sut.add(accountData);
            await expect(addPromise).rejects.toThrow();
        });

        test('should throw if FindUserByEmailRepository throws', async () => {
            const { sut, findUserByEmailRepositoryStub } = makeSut();

            jest.spyOn(findUserByEmailRepositoryStub, 'findUserByEmail').mockImplementation(() => {
                throw new Error('Test throw');
            });

            const accountData = makeValidCreateUserAttributes();

            const addPromise = sut.add(accountData);
            await expect(addPromise).rejects.toThrow();
        });

        test('should call FindUserByEmailRepository with correct value', async () => {
            const { sut, findUserByEmailRepositoryStub } = makeSut();
            const findUserByEmailRepositorySpy = jest.spyOn(findUserByEmailRepositoryStub, 'findUserByEmail');

            const userData = makeValidCreateUserAttributes();

            await sut.add(userData);

            expect(findUserByEmailRepositorySpy).toHaveBeenCalledWith('valid e-mail');
        });

        test('should throw if e-mail already exists', async () => {
            const { sut, findUserByEmailRepositoryStub } = makeSut();
            jest.spyOn(findUserByEmailRepositoryStub, 'findUserByEmail').mockImplementationOnce(async () => {
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
            const { sut, updateUserRepositoryStub } = makeSut();
            const updateUserRepositorySpy = jest.spyOn(updateUserRepositoryStub, 'update');

            const userData = { name: 'new name' };

            await sut.update('valid id', userData);

            expect(updateUserRepositorySpy).toHaveBeenCalledWith('valid id', {
                name: 'new name'
            });
        });

        test('should return updated user data', async () => {
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

        test('should throw if UpdateUserRepository throws', async () => {
            const { sut, updateUserRepositoryStub } = makeSut();
            const userData = { name: 'new name' };

            jest.spyOn(updateUserRepositoryStub, 'update').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const updatePromise = sut.update('valid id', userData);

            await expect(updatePromise).rejects.toThrow(new Error('Test throw'));
        });
    });
});
