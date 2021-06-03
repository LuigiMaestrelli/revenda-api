import { makeDeleteBrandValidation } from '@/main/factories/controller/brand/deleteBrandValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('DeleteBrandValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeDeleteBrandValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
