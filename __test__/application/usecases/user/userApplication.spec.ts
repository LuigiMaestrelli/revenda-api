import { Encrypter } from '@/application/interfaces/encrypter';
import { UserApplication } from '@/application/usecases/user/userApplication';
// import { UserModel } from '@/domain/models/user/User';
import { AddUserModel } from '@/domain/usecases/user/addUser';

type SutTypes = {
    encrypterStub: Encrypter;
    //  addUserRepository: AddUserRepository;
    sut: UserApplication;
};

const makeValidAddUserModel = (): AddUserModel => {
    return {
        name: 'valid name',
        email: 'valid email',
        password: 'valid password'
    };
};

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(value: string): Promise<string> {
            return 'encrypted password';
        }
    }

    return new EncrypterStub();
};
/*
const makeAddUserRepository = (): AddUserRepository => {
    class AddUserRepositoryStub implements AddUserRepository {
        async add(accountData: AddUserModel): Promise<UserModel> {
            const fakeUser = {
                id: 'valid id',
                email: 'valid e-mail',
                name: 'valid name',
                passwordHash: 'hashed password'
            };

            return fakeUser;
        }
    }

    return new AddUserRepositoryStub();
};
*/
const makeSut = (): SutTypes => {
    const encrypterStub = makeEncrypter();
    // const addUserRepository = makeAddUserRepository();
    const sut = new UserApplication(encrypterStub);

    return {
        encrypterStub,
        //    addUserRepository,
        sut
    };
};

describe('User Usecase', () => {
    test('should call Encrypter with correct value', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

        const accountData = makeValidAddUserModel();

        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith('valid password');
    });

    test('should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();

        jest.spyOn(encrypterStub, 'encrypt').mockImplementation(() => {
            throw new Error('Test throw');
        });

        const accountData = makeValidAddUserModel();

        const addPromise = sut.add(accountData);
        await expect(addPromise).rejects.toThrow();
    });
    /*
    test('should call AddUserRepository with correct values', async () => {
        const { sut, addUserRepositoryStub } = makeSut();
        const addUserRepositorySpy = jest.spyOn(addUserRepositoryStub, 'add');

        const accountData = makeValidAddUserModel();

        await sut.add(accountData);

        expect(addUserRepositorySpy).toHaveBeenCalledWith({
            name: 'valid name',
            email: 'valid email',
            password: 'encrypted password'
        });
    });

    */
});
