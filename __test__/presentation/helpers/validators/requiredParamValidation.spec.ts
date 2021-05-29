import { MissingParamError } from '@/shared/errors';
import { RequiredParamValidation } from '@/presentation/helpers/validators/requiredParamValidation';

describe('RequiredParam Validation', () => {
    test('should throw a MissingParamError if validation fails with no param', async () => {
        const httpRequest = {
            params: {
                otherParam: 1
            },
            body: {}
        };

        const sut = new RequiredParamValidation('someParam');
        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new MissingParamError('someParam'));
    });

    test('should throw a MissingParamError if validation fails with null param', async () => {
        const params: any = {
            otherParam: 1,
            someParam: null
        };

        const httpRequest = {
            params,
            body: {}
        };

        const sut = new RequiredParamValidation('someParam');
        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new MissingParamError('someParam'));
    });

    test('should not throw if validation succeeds', async () => {
        const httpRequest = {
            params: {
                someParam: 1
            },
            body: {}
        };

        const sut = new RequiredParamValidation('someParam');
        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
