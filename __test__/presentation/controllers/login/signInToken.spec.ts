import { AuthenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { SignInTokenController } from '@/presentation/controllers/login/signInToken';
import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';

type SutTypes = {
    sut: SignInTokenController;
    validationStub: IValidation;
    generateAuthStub: IGenerateAuthentication;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeGenerateAuth = (): IGenerateAuthentication => {
    class GenerateAuthenticationStub implements IGenerateAuthentication {
        async auth(autentication: AuthenticationAttributes): Promise<AuthenticationResult> {
            return {
                token: 'valid token',
                refreshToken: 'valid refreshtoken',
                expiresIn: 1000
            };
        }

        async refreshAuth(refreshToken: string): Promise<AuthenticationResult> {
            return {
                token: 'valid token',
                refreshToken: 'valid refreshtoken',
                expiresIn: 1000
            };
        }
    }

    return new GenerateAuthenticationStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const generateAuthStub = makeGenerateAuth();
    const sut = new SignInTokenController(validationStub, generateAuthStub);

    return {
        sut,
        validationStub,
        generateAuthStub
    };
};

describe('SignInToken Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();
        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            body: {
                email: 'valid_email@email.com',
                password: 'any password'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            body: {
                email: 'valid_email@email.com',
                password: 'any password'
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
                email: 'invalid_email',
                password: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toBe('Missing param: Test throw');
    });

    test('should call generateAuth with correct values', async () => {
        const { sut, generateAuthStub } = makeSut();
        const generateAuthSpy = jest.spyOn(generateAuthStub, 'auth');

        const httpRequest = {
            body: {
                email: 'valid_email@email.com',
                password: 'any password'
            },
            networkAccess: {
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host',
                origin: 'valid origin'
            }
        };

        await sut.handle(httpRequest);

        expect(generateAuthSpy).toBeCalledWith(
            {
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

    test('should return 500 if GenerateAuth throws', async () => {
        const { sut, generateAuthStub } = makeSut();

        jest.spyOn(generateAuthStub, 'auth').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            body: {
                email: 'invalid_email',
                password: 'any password'
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
                email: 'valid_email@email.com',
                password: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should return auth data if valid data is sent', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                email: 'valid_email@email.com',
                password: 'any password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body).toEqual({
            token: 'valid token',
            refreshToken: 'valid refreshtoken',
            expiresIn: 1000
        });
    });
});
