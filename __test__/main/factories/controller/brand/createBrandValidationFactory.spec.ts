import { makeCreateBrandValidation } from '@/main/factories/controller/brand/createBrandValidationFactory';
import { ValidationComposite, RequiredFieldValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('CreateBrandValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeCreateBrandValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredFieldValidation('description'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
