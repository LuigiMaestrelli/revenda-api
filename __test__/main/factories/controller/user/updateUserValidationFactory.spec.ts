import { makeUpdateUserValidation } from '@/main/factories/controller/user/updateUserValidationFactory';
import {
    ValidationComposite,
    RequiredParamValidation,
    RequiredFieldValidation
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('UpdateUserValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeUpdateUserValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));
        validations.push(new RequiredFieldValidation('name'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
