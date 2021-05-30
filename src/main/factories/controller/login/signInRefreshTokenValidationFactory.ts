import { RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

export const makeSignInRefreshTokenValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];
    validations.push(new RequiredFieldValidation('refreshToken'));
    return new ValidationComposite(validations);
};
