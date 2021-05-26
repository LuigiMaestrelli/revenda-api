import { makeUpdateUserImageValidation } from '@/main/factories/controller/user/updateUserImageValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('UpdateUserImageValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeUpdateUserImageValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
