import { AuthenticationAttributes, AuthenticationResult } from '@/domain/models/auth/authentication';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { SignInRefreshTokenController } from '@/presentation/controllers/login/signInRefreshToken';
import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';

type SutTypes = {
    sut: SignInRefreshTokenController;
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
    const sut = new SignInRefreshTokenController(validationStub, generateAuthStub);

    return {
        sut,
        validationStub,
        generateAuthStub
    };
};

describe('SignInRefreshToken Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();
        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            body: {
                refreshToken: 'valid refreshtoken'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            body: {
                refreshToken: 'valid refreshtoken'
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
                refreshToken: 'invalid refreshtoken'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toBe('Missing param: Test throw');
    });

    test('should call generateAuth with correct values', async () => {
        const { sut, generateAuthStub } = makeSut();
        const generateRefreshAuthSpy = jest.spyOn(generateAuthStub, 'refreshAuth');

        const httpRequest = {
            body: {
                refreshToken: 'valid refreshtoken'
            }
        };

        await sut.handle(httpRequest);

        expect(generateRefreshAuthSpy).toBeCalledWith('valid refreshtoken');
    });

    test('should return 500 if GenerateAuth throws', async () => {
        const { sut, generateAuthStub } = makeSut();

        jest.spyOn(generateAuthStub, 'refreshAuth').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            body: {
                refreshToken: 'valid refreshtoken'
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
                refreshToken: 'valid refreshtoken'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should return auth data if valid data is sent', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                refreshToken: 'valid refreshtoken'
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
