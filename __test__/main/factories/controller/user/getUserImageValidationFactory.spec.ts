import { makeGetUserImage } from '@/main/factories/controller/user/getUserImageFactory';
import { ValidationComposite, RequiredParamValidation } from '@/presentation/helpers/validators';
import { IValidation } from '@/presentation/protocols';

jest.mock('@/presentation/helpers/validators/validationComposite');

describe('GetUserImageValidation Factory', () => {
    test('should call ValidationComposite with all validations', async () => {
        makeGetUserImage();

        const validations: IValidation[] = [];
        validations.push(new RequiredParamValidation('id'));

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
