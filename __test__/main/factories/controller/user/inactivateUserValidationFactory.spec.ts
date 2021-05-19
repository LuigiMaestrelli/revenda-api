import { makeInactivateUserValidation } from '@/main/factories/controller/user/inactivateUserValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('InactivateUser Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeInactivateUserValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
