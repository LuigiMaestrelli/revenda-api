import { Hasher } from '@/infra/interfaces/cryptography';
import { UserApplication } from '@/application/usecases/user/userApplication';
import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/User';
import { IAddUserRepository } from '@/domain/repository/user/user';

type SutTypes = {
    hasherStub: Hasher;
    addUserRepositoryStub: IAddUserRepository;
    sut: UserApplication;
};

const makeValidCreateUserAttributes = (): CreateUserAttributes => {
    return {
        name: 'valid name',
        email: 'valid email',
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

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher();
    const addUserRepositoryStub = makeAddUserRepository();
    const sut = new UserApplication(hasherStub, addUserRepositoryStub);

    return {
        hasherStub,
        addUserRepositoryStub,
        sut
    };
};

describe('User Usecase', () => {
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
            email: 'valid email',
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
});
