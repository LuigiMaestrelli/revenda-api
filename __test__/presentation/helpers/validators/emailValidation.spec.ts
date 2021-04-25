import { InvalidParamError } from '@/shared/errors';
import { EmailValidation } from '@/presentation/helpers/validators/emailValidation';
import { IEmailValidator } from '@/presentation/protocols/emailValidator';

interface SutTypes {
    sut: EmailValidation;
    emailValidatorStub: IEmailValidator;
}

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
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
    test('should call EmailValidator with a valid email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const input = {
            email: 'any_email@teste.com.br'
        };

        await sut.validate(input);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@teste.com.br');
    });

    test('should throw if email validator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
            throw new Error('Test throw');
        });

        await expect(sut.validate).rejects.toThrow();
    });

    test('should thrown an Error with EmailValidator returns false', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const input = {
            email: 'any_email@teste.com.br'
        };

        const validatorPromise = sut.validate(input);
        await expect(validatorPromise).rejects.toThrow(new InvalidParamError('email'));
    });

    test('should not throw if validation succeeds', async () => {
        const { sut } = makeSut();

        const input = {
            someField: 'any data',
            otherField: 'any data'
        };

        const validatorPromise = sut.validate(input);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
