import { makeActivateBrandValidation } from '@/main/factories/controller/brand/activateBrandValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('ActivateBrandValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeActivateBrandValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
