import { makeSignUpValidation } from '@/main/factories/controller/login/signupValidationFactory';
import {
    ValidationComposite,
    RequiredFieldValidation,
    CompareFieldsValidation,
    EmailValidation,
    StrongPasswordValidation
} from '@/presentation/helpers/validators';
import { Validation } from '@/presentation/interfaces/validation';
import { EmailValidator } from '@/presentation/interfaces/emailValidator';
import { PasswordValidator } from '@/presentation/interfaces/passwordValidator';

jest.mock('../../../../../src/presentation/helpers/validators/validationComposite');

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
};

const makePasswordValidator = (): PasswordValidator => {
    class PasswordValidatorStub implements PasswordValidator {
        isStrongPassword(email: string): boolean {
            return true;
        }
    }

    return new PasswordValidatorStub();
};

describe('SignUpValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeSignUpValidation();

        const validations: Validation[] = [];

        for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
            validations.push(new RequiredFieldValidation(field));
        }

        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
        validations.push(new EmailValidation('email', makeEmailValidator()));
        validations.push(new StrongPasswordValidation('password', makePasswordValidator()));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
