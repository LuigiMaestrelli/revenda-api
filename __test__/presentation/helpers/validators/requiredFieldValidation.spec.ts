import { MissingParamError } from '@/shared/errors';
import { RequiredFieldValidation } from '@/presentation/helpers/validators/requiredFieldValidation';

describe('RequiredField Validation', () => {
    test('should throw a MissingParamError if validation fails', async () => {
        const sut = new RequiredFieldValidation('someField');

        const httpRequest = {
            body: {
                otherField: 'any data'
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new MissingParamError('someField'));
    });

    test('should not throw if validation succeeds', async () => {
        const sut = new RequiredFieldValidation('someField');

        const httpRequest = {
            body: {
                someField: 'any data'
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
