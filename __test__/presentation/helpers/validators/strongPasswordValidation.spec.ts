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
    test('should call PasswordValidator with a strong password', () => {
        const { sut, passwordValidatorStub } = makeSut();
        const isStrongPasswordSpy = jest.spyOn(passwordValidatorStub, 'isStrongPassword');

        const input = {
            password: 'Oao$@9wejWE90uasd723'
        };

        sut.validate(input);
        expect(isStrongPasswordSpy).toHaveBeenCalledWith('Oao$@9wejWE90uasd723');
    });

    test('should throw if password validator throws', () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isStrongPassword').mockImplementation(() => {
            throw new Error('Test throw');
        });

        expect(sut.validate).toThrow();
    });

    test('should return an Error with PasswordValidation returns false', () => {
        const { sut, passwordValidatorStub } = makeSut();
        jest.spyOn(passwordValidatorStub, 'isStrongPassword').mockReturnValueOnce(false);

        const input = {
            password: 'password'
        };

        const error = sut.validate(input);
        expect(error).toEqual(new InvalidParamError('password is too week'));
    });
});
