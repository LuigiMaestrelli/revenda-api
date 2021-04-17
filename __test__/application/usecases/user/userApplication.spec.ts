import { Hasher } from '@/infra/interfaces/cryptography';
import { UserApplication } from '@/application/usecases/user/userApplication';
import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/User';
import { IAddUserRepository, IFindUserByEmailRepository } from '@/domain/repository/user/user';
import { InvalidParamError } from '@/shared/errors';

type SutTypes = {
    hasherStub: Hasher;
    addUserRepositoryStub: IAddUserRepository;
    findUserByEmailRepositoryStub: IFindUserByEmailRepository;
    sut: UserApplication;
};

const makeValidCreateUserAttributes = (): CreateUserAttributes => {
    return {
        name: 'valid name',
        email: 'valid e-mail',
        password: 'valid password'
    };
};

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
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
                password: 'hashed password'
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

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher();
    const addUserRepositoryStub = makeAddUserRepository();
    const findUserByEmailRepositoryStub = makeFindUserByEmailRepository();
    const sut = new UserApplication(hasherStub, addUserRepositoryStub, findUserByEmailRepositoryStub);

    return {
        hasherStub,
        addUserRepositoryStub,
        findUserByEmailRepositoryStub,
        sut
    };
};

describe('Add User Application', () => {
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

    test('should return created user data', async () => {
        const { sut } = makeSut();
        const userData = makeValidCreateUserAttributes();

        const user = await sut.add(userData);

        expect(user).toEqual({
            id: 'valid id',
            name: 'valid name',
            email: 'valid e-mail',
            password: 'hashed password'
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
                    password: 'hashed password'
                })
            );
        });

        const userData = makeValidCreateUserAttributes();

        const addPromise = sut.add(userData);
        await expect(addPromise).rejects.toThrow(new InvalidParamError('e-mail already in use'));
    });
});
