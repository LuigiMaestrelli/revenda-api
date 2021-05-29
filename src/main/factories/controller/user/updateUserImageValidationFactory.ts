import {
    RequiredParamValidation,
    RequireSingleFileValidation,
    ValidationComposite
} from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols/validation';

export const makeUpdateUserImageValidation = (): ValidationComposite => {
    const validations: IValidation[] = [];
    validations.push(new RequiredParamValidation('id'));
    validations.push(new RequireSingleFileValidation('image'));

    return new ValidationComposite(validations);
};
