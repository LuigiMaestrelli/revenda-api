import { SignUpController } from '@/presentation/controllers/login/signUp';
import { IValidation } from '@/presentation/protocols';
import { IAddUser } from '@/domain/usecases/user/user';
import { CreateUserAttributes, UserWithAuthAttributes } from '@/domain/models/user/user';

type SutTypes = {
    sut: SignUpController;
    validationStub: IValidation;
    addUserUseCaseStub: IAddUser;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeAddUserUseCase = (): IAddUser => {
    class AddUserUseCaseStub implements IAddUser {
        async add(user: CreateUserAttributes): Promise<UserWithAuthAttributes> {
            return {
                user: {
                    id: 'valid_id',
                    name: 'valid name',
                    email: 'valid_email@email.com',
                    password: 'hashed password'
                },
                auth: {
                    token: 'valid token',
                    refreshToken: 'valid refreshtoken',
                    expiresIn: 100
                }
            };
        }
    }

    return new AddUserUseCaseStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const addUserUseCaseStub = makeAddUserUseCase();
    const sut = new SignUpController(validationStub, addUserUseCaseStub);

    return {
        sut,
        validationStub,
        addUserUseCaseStub
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
            user: {
                id: 'valid_id',
                name: 'valid name',
                email: 'valid_email@email.com',
                password: 'hashed password'
            },
            auth: {
                token: 'valid token',
                refreshToken: 'valid refreshtoken',
                expiresIn: 100
            }
        });
    });

    test('should call AddUser with correct values', async () => {
        const { sut, addUserUseCaseStub } = makeSut();

        const addSpy = jest.spyOn(addUserUseCaseStub, 'add');

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
        const { sut, addUserUseCaseStub } = makeSut();

        jest.spyOn(addUserUseCaseStub, 'add').mockImplementation(async () => {
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
