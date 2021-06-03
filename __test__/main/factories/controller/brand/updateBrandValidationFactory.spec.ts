import { makeUpdateBrandValidation } from '@/main/factories/controller/brand/updateBrandValidationFactory';
import {
    ValidationComposite,
    RequiredParamValidation,
    RequiredFieldValidation
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('UpdateBrandValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeUpdateBrandValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));
        validations.push(new RequiredFieldValidation('description'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
