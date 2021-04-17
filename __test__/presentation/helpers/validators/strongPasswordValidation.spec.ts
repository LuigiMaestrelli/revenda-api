import { InvalidParamError } from '@/shared/errors';
import { StrongPasswordValidation } from '@/presentation/helpers/validators/strongPasswordValidation';
import { PasswordValidator } from '@/presentation/interfaces/passwordValidator';

interface SutTypes {
    sut: StrongPasswordValidation;
    passwordValidatorStub: PasswordValidator;
}

const makePasswordValidator = (): PasswordValidator => {
    class PasswordValidatorStub implements PasswordValidator {
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

        const input = {
            password: 'Oao$@9wejWE90uasd723'
        };

        await sut.validate(input);
        expect(isStrongPasswordSpy).toHaveBeenCalledWith('Oao$@9wejWE90uasd723');
    });

    test('should throw if password validator throws', async () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isStrongPassword').mockImplementationOnce(() => {
            throw new Error('Test throw');
        });

        const validatorPromise = sut.validate('Teste');
        await expect(validatorPromise).rejects.toThrow();
    });

    test('should thrown an Error with PasswordValidation returns false', async () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isStrongPassword').mockReturnValueOnce(false);

        const input = {
            password: 'password'
        };

        const validatorPromise = sut.validate(input);
        await expect(validatorPromise).rejects.toThrow(new InvalidParamError('password is too week'));
    });

    test('should not throw if validation succeeds', async () => {
        const { sut } = makeSut();

        const validatorPromise = sut.validate('teste');
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
