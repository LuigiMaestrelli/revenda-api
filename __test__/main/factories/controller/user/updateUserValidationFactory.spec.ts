import { makeUpdateUserValidation } from '@/main/factories/controller/user/updateUserValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('UpdateUserValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeUpdateUserValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
