import { makeGetBrandByIdValidation } from '@/main/factories/controller/brand/getBrandByIdValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('GetBrandByIdValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeGetBrandByIdValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
