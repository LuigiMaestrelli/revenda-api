import { makeSignInRefreshTokenValidation } from '@/main/factories/controller/login/signInRefreshTokenValidationFactory';
import { ValidationComposite, RequiredFieldValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('SignInTokenValidationValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeSignInRefreshTokenValidation();

        const validations: IValidation[] = [];
        validations.push(new RequiredFieldValidation('refreshToken'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
