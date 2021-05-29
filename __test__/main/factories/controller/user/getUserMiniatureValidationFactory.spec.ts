import { makeGetUserMiniatureValidation } from '@/main/factories/controller/user/getUserMiniatureValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('GetUserMiniatureValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeGetUserMiniatureValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
