import { PasswordValidatorAdapter } from '@/infra/adapters/validators/passwordValidatorAdapter';
import { makechangeUserPasswordValidation } from '@/main/factories/controller/user/changeUserPasswordValidationFactory';
import {
    ValidationComposite,
    RequiredParamValidation,
    RequiredFieldValidation,
    CompareFieldsValidation,
    StrongPasswordValidation
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('changeUserPasswordValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makechangeUserPasswordValidation();

        const validations: IValidation[] = [];

        validations.push(new RequiredParamValidation('id'));
        for (const field of ['currentPassword', 'newPassword', 'newPasswordConfirmation']) {
            validations.push(new RequiredFieldValidation(field));
        }

        validations.push(new CompareFieldsValidation('newPassword', 'newPasswordConfirmation'));
        validations.push(new StrongPasswordValidation('newPassword', new PasswordValidatorAdapter()));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
