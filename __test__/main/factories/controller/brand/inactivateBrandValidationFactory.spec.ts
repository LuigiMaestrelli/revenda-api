import { makeInactivateBrandValidation } from '@/main/factories/controller/brand/inactivateBrandValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('InactivateBrandValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeInactivateBrandValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
