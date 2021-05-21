import {
    CompareFieldsValidation,
    RequiredFieldValidation,
    ValidationComposite,
    StrongPasswordValidation,
    RequiredParamValidation
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';
import { PasswordValidatorAdapter } from '@/infra/adapters/validators/passwordValidatorAdapter';

export const makechangeUserPasswordValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];

    validations.push(new RequiredParamValidation('id'));

    for (const field of ['currentPassword', 'newPassword', 'newPasswordConfirmation']) {
        validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new CompareFieldsValidation('newPassword', 'newPasswordConfirmation'));
    validations.push(new StrongPasswordValidation('newPassword', new PasswordValidatorAdapter()));

    return new ValidationComposite(validations);
};
