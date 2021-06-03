import { RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

export const makeCreateBrandValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];

    for (const field of ['description']) {
        validations.push(new RequiredFieldValidation(field));
    }

    return new ValidationComposite(validations);
};
