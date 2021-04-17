import { SignUpController } from '@/presentation/controllers/login/signUp';
import { Validation } from '@/presentation/interfaces';
import { IAddUserApplication } from '@/domain/usecases/user/addUser';
import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';

type SutTypes = {
    sut: SignUpController;
    validationStub: Validation;
    addUserApplicationStub: IAddUserApplication;
};

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeAddUserApplication = (): IAddUserApplication => {
    class AddUserApplicationStub implements IAddUserApplication {
        async add(user: CreateUserAttributes): Promise<UserAttributes> {
            return {
                id: 'valid_id',
                name: 'valid name',
                email: 'valid_email@email.com',
                password: 'valid hash'
            };
        }
    }

    return new AddUserApplicationStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const addUserApplicationStub = makeAddUserApplication();
    const sut = new SignUpController(validationStub, addUserApplicationStub);

    return {
        sut,
        validationStub,
        addUserApplicationStub
    };
};

describe('SignUp Controller', () => {
    test('should return 200 if valid data is sent', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should return created user data after created', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid name',
            email: 'valid_email@email.com',
            password: 'valid hash'
        });
    });

    test('should call AddUser with correct values', async () => {
        const { sut, addUserApplicationStub } = makeSut();

        const addSpy = jest.spyOn(addUserApplicationStub, 'add');

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        await sut.handle(httpRequest);
        expect(addSpy).toBeCalledWith({
            name: 'Any name',
            email: 'valid_email@email.com',
            password: 'any password'
        });
    });

    test('should return 500 if AddUser throws', async () => {
        const { sut, addUserApplicationStub } = makeSut();

        jest.spyOn(addUserApplicationStub, 'add').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'invalid_email',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });
});