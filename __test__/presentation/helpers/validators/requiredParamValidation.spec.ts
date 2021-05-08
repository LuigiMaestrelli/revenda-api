import { MissingParamError } from '@/shared/errors';
import { RequiredParamValidation } from '@/presentation/helpers/validators/requiredParamValidation';

describe('RequiredParam Validation', () => {
    test('should throw a MissingParamError if validation fails', async () => {
        const sut = new RequiredParamValidation('someParam');

        const httpRequest = {
            params: {
                otherParam: 1
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new MissingParamError('someParam'));
    });

    test('should not throw if validation succeeds', async () => {
        const sut = new RequiredParamValidation('someParam');

        const httpRequest = {
            params: {
                someParam: 1
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
