import { InvalidParamError } from '@/shared/errors';
import { StrongPasswordValidation } from '@/presentation/helpers/validators/strongPasswordValidation';
import { IPasswordValidator } from '@/presentation/protocols/passwordValidator';

interface SutTypes {
    sut: StrongPasswordValidation;
    passwordValidatorStub: IPasswordValidator;
}

const makePasswordValidator = (): IPasswordValidator => {
    class PasswordValidatorStub implements IPasswordValidator {
        isStrongPassword(email: string): boolean {
            return true;
        }
    }

    return new PasswordValidatorStub();
};

const makeSut = (): SutTypes => {
    const passwordValidatorStub = makePasswordValidator();
    const sut = new StrongPasswordValidation('password', passwordValidatorStub);

    return {
        sut,
        passwordValidatorStub
    };
};

describe('Password Validation', () => {
    test('should call PasswordValidator with a strong password', async () => {
        const { sut, passwordValidatorStub } = makeSut();
        const isStrongPasswordSpy = jest.spyOn(passwordValidatorStub, 'isStrongPassword');

        const httpRequest = {
            body: {
                password: 'Oao$@9wejWE90uasd723'
            }
        };

        await sut.validate(httpRequest);
        expect(isStrongPasswordSpy).toHaveBeenCalledWith('Oao$@9wejWE90uasd723');
    });

    test('should throw if password validator throws', async () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isStrongPassword').mockImplementationOnce(() => {
            throw new Error('Test throw');
        });

        const httpRequest = {
            body: {}
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new Error('Test throw'));
    });

    test('should thrown an Error with PasswordValidation returns false', async () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isStrongPassword').mockReturnValueOnce(false);

        const httpRequest = {
            body: {
                password: 'password'
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new InvalidParamError('password is too week'));
    });

    test('should thrown an Error with PasswordValidation returns false with no password', async () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isStrongPassword').mockReturnValueOnce(false);

        const body: any = {
            password: null
        };

        const httpRequest = {
            body
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new InvalidParamError('password is too week'));
    });

    test('should not throw if validation succeeds', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {}
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
