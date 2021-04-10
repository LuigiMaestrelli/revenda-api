import { Encrypter } from '@/application/interfaces/encrypter';
import { UserApplication } from '@/application/usecases/user/userApplication';
import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/User';
import { IAddUserRepository } from '@/domain/usecases/user/addUser';

type SutTypes = {
    encrypterStub: Encrypter;
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

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return 'hashed password';
        }
    }

    return new EncrypterStub();
};

const makeAddUserRepository = (): IAddUserRepository => {
    class AddUserRepositoryStub implements IAddUserRepository {
        async add(accountData: CreateUserAttributes): Promise<UserAttributes> {
            return {
                id: 'valid id',
                email: 'valid e-mail',
                name: 'valid name',
                passwordHash: 'hashed password'
            };
        }
    }

    return new AddUserRepositoryStub();
};

const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    const addUserRepositoryStub = makeAddUserRepository();
    const sut = new UserApplication(encrypterStub, addUserRepositoryStub);

    return {
        encrypterStub,
        addUserRepositoryStub,
        sut
    };
};

describe('User Usecase', () => {
    test('should call Encrypter with correct value', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

        const accountData = makeValidCreateUserAttributes();

        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith('valid password');
    });

    test('should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();

        jest.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
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
            passwordHash: 'hashed password'
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
