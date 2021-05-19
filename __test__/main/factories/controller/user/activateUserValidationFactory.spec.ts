import { makeActivateUserValidation } from '@/main/factories/controller/user/activateUserValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('ActivateUser Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeActivateUserValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
