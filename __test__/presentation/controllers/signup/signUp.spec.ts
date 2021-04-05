import { SignUpController } from '@/presentation/controllers/signup/signUp';
import { EmailValidator, PasswordValidator } from '@/presentation/interfaces';
import { IAddUserApplication, AddUserModel } from '@/domain/usecases/user/addUser';
import { UserModel } from '@/domain/models/user/User';

type SutTypes = {
    sut: SignUpController;
    emailValidationStub: EmailValidator;
    addUserStub: IAddUserApplication;
    passwordValidationStub: PasswordValidator;
};

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(input: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makePasswordValidator = (): PasswordValidator => {
    class PasswordValidatorStub implements PasswordValidator {
        isStrongPassword(input: string): boolean {
            return true;
        }
    }

    return new PasswordValidatorStub();
};

const makeAddUser = (): IAddUserApplication => {
    class AddUserStub implements IAddUserApplication {
        async add(user: AddUserModel): Promise<UserModel> {
            const fakeUser = {
                id: 'valid_id',
                name: 'valid name',
                email: 'valid_email@email.com',
                passwordHash: 'valid hash'
            };

            return fakeUser;
        }
    }

    return new AddUserStub();
};

const makeSut = (): SutTypes => {
    const emailValidationStub = makeEmailValidator();
    const passwordValidationStub = makePasswordValidator();
    const addUserStub = makeAddUser();
    const sut = new SignUpController(emailValidationStub, passwordValidationStub, addUserStub);

    return {
        sut,
        emailValidationStub,
        passwordValidationStub,
        addUserStub
    };
};

describe('SignUp Controller', () => {
    test('should return 400 if no name is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual('Missing param: name');
    });

    test('should return 400 if no e-mail is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'Any name',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual('Missing param: email');
    });

    test('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'any_email@email.com',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual('Missing param: password');
    });

    test('should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'any_email@email.com',
                password: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual('Missing param: passwordConfirmation');
    });

    test('should return 400 if the password and passwordConfirmation do not match', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'any_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any other password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual('Invalid param: password');
    });

    test('should return 400 if an invalid e-mail is provided', async () => {
        const { sut, emailValidationStub } = makeSut();
        jest.spyOn(emailValidationStub, 'isValid').mockReturnValueOnce(false);

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'invalid_email',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toEqual('Invalid param: email');
    });

    test('should call EmailValidation with correct values', async () => {
        const { sut, emailValidationStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidationStub, 'isValid');

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        await sut.handle(httpRequest);
        expect(isValidSpy).toBeCalledWith('valid_email@email.com');
    });

    test('should return 500 if EmailValidation throws', async () => {
        const { sut, emailValidationStub } = makeSut();

        jest.spyOn(emailValidationStub, 'isValid').mockImplementation(() => {
            throw new Error('Test throw');
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
            passwordHash: 'valid hash'
        });
    });

    test('should call AddUser with correct values', async () => {
        const { sut, addUserStub } = makeSut();

        const addSpy = jest.spyOn(addUserStub, 'add');

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
        const { sut, addUserStub } = makeSut();

        jest.spyOn(addUserStub, 'add').mockImplementation(() => {
            throw new Error('Test throw');
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

    test('should call PasswordValidator with correct values', async () => {
        const { sut, passwordValidationStub } = makeSut();

        const isStrongPasswordSpy = jest.spyOn(passwordValidationStub, 'isStrongPassword');

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        await sut.handle(httpRequest);
        expect(isStrongPasswordSpy).toBeCalledWith('any password');
    });

    test('should return 500 if PasswordValidator throws', async () => {
        const { sut, passwordValidationStub } = makeSut();

        jest.spyOn(passwordValidationStub, 'isStrongPassword').mockImplementation(() => {
            throw new Error('Test throw');
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

    test('should return 400 if an invalid password is provided', async () => {
        const { sut, passwordValidationStub } = makeSut();

        jest.spyOn(passwordValidationStub, 'isStrongPassword').mockReturnValueOnce(false);

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'invalid password',
                passwordConfirmation: 'invalid password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toBe('Invalid param: password is too week');
    });
});
