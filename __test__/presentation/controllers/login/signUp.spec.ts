import { SignUpController } from '@/presentation/controllers/login/signUp';
import { IValidation } from '@/presentation/protocols';
import { IUserUseCase } from '@/domain/usecases/user/user';
import { MissingParamError } from '@/shared/errors';
import { makeUserUseCaseStub } from '@test/utils/mocks/application/user';

type SutTypes = {
    sut: SignUpController;
    validationStub: IValidation;
    userUseCaseStub: IUserUseCase;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const userUseCaseStub = makeUserUseCaseStub();
    const sut = new SignUpController(validationStub, userUseCaseStub);

    return {
        sut,
        validationStub,
        userUseCaseStub
    };
};

describe('SignUp Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();
        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        });
    });

    test('should return 400 if validation throws', async () => {
        const { sut, validationStub } = makeSut();

        jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new MissingParamError('Test throw')));
        });

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toBe('Missing param: Test throw');
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
            user: {
                id: 'valid_id',
                name: 'valid name',
                email: 'valid_email@email.com',
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

    test('should call AddUser with correct values', async () => {
        const { sut, userUseCaseStub } = makeSut();

        const addSpy = jest.spyOn(userUseCaseStub, 'add');

        const httpRequest = {
            body: {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password',
                passwordConfirmation: 'any password'
            },
            networkAccess: {
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host',
                origin: 'valid origin'
            }
        };

        await sut.handle(httpRequest);
        expect(addSpy).toBeCalledWith(
            {
                name: 'Any name',
                email: 'valid_email@email.com',
                password: 'any password'
            },
            {
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host',
                origin: 'valid origin'
            }
        );
    });

    test('should return 500 if AddUser throws', async () => {
        const { sut, userUseCaseStub } = makeSut();

        jest.spyOn(userUseCaseStub, 'add').mockImplementation(async () => {
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
