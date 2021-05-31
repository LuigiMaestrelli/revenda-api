import {
    CompareFieldsValidation,
    EmailValidation,
    RequiredFieldValidation,
    ValidationComposite,
    StrongPasswordValidation
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';
import { EmailValidatorAdapter } from '@/infra/adapters/validators/emailValidatorAdapter';
import { PasswordValidatorAdapter } from '@/infra/adapters/validators/passwordValidatorAdapter';

export const makeSignUpValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
    validations.push(new StrongPasswordValidation('password', new PasswordValidatorAdapter()));
    return new ValidationComposite(validations);
};
