import {
    RequiredFieldValidation,
    RequiredParamValidation,
    ValidationComposite
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

export const makeUpdateBrandValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];
    validations.push(new RequiredParamValidation('id'));

    for (const field of ['description']) {
        validations.push(new RequiredFieldValidation(field));
    }

    return new ValidationComposite(validations);
};
