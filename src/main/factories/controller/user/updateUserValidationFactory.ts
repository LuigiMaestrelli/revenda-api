import {
    RequiredParamValidation,
    ValidationComposite,
    RequiredFieldValidation
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

export const makeUpdateUserValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];
    validations.push(new RequiredParamValidation('id'));
    validations.push(new RequiredFieldValidation('name'));

    return new ValidationComposite(validations);
};
