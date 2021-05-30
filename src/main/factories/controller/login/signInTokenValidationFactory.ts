import { RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

export const makeSignInTokenValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];

    for (const field of ['email', 'password']) {
        validations.push(new RequiredFieldValidation(field));
    }

    return new ValidationComposite(validations);
};
