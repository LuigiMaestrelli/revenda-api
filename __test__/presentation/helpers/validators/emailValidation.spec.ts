import { InvalidParamError } from '@/shared/errors';
import { EmailValidation } from '@/presentation/helpers/validators/emailValidation';
import { EmailValidator } from '@/presentation/interfaces/emailValidator';

interface SutTypes {
    sut: EmailValidation;
    emailValidatorStub: EmailValidator;
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const sut = new EmailValidation('email', emailValidatorStub);

    return {
        sut,
        emailValidatorStub
    };
};

describe('Email Validation', () => {
    test('should call EmailValidator with a valid email', () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const input = {
            email: 'any_email@teste.com.br'
        };

        sut.validate(input);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@teste.com.br');
    });

    test('should throw if email validator throws', () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
            throw new Error('Test throw');
        });

        expect(sut.validate).toThrow();
    });

    test('should return an Error with EmailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const input = {
            email: 'any_email@teste.com.br'
        };

        const error = sut.validate(input);
        expect(error).toEqual(new InvalidParamError('email'));
    });
});
