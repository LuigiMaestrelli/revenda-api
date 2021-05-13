import { RequiredParamValidation, ValidationComposite } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

export const makeUpdateUserValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];
    validations.push(new RequiredParamValidation('id'));

    return new ValidationComposite(validations);
};
