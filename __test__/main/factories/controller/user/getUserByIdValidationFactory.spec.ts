import { makeGetUserByIdValidation } from '@/main/factories/controller/user/getUserByIdValidationFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('SignUpValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeGetUserByIdValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
