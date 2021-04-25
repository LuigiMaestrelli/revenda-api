import { makeSignUpValidation } from '@/main/factories/controller/login/signupValidationFactory';
import {
    ValidationComposite,
    RequiredFieldValidation,
    CompareFieldsValidation,
    EmailValidation,
    StrongPasswordValidation
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';
import { IEmailValidator } from '@/presentation/protocols/emailValidator';
import { IPasswordValidator } from '@/presentation/protocols/passwordValidator';

jest.mock('@/presentation/helpers/validators/validationComposite');

const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makePasswordValidator = (): IPasswordValidator => {
    class PasswordValidatorStub implements IPasswordValidator {
        isStrongPassword(email: string): boolean {
            return true;
        }
    }

    return new PasswordValidatorStub();
};

describe('SignUpValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeSignUpValidation();

        const validations: IValidation[] = [];

        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field));
        }

        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
        validations.push(new EmailValidation('email', makeEmailValidator()));
        validations.push(new StrongPasswordValidation('password', makePasswordValidator()));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
