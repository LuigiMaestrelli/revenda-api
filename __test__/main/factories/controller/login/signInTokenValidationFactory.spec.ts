import { makeSignInTokenValidation } from '@/main/factories/controller/login/signInTokenValidationFactory';
import { ValidationComposite, RequiredFieldValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('SignInTokenValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeSignInTokenValidation();

        const validations: IValidation[] = [];

        for (const field of ['email', 'password']) {
            validations.push(new RequiredFieldValidation(field));
        }

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
