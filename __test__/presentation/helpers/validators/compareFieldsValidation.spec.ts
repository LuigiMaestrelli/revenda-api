import { InvalidParamError } from '@/shared/errors';
import { CompareFieldsValidation } from '@/presentation/helpers/validators/compareFieldsValidation';

describe('CompareFields Validation', () => {
    test('should throw a InvalidParamError if validation fails', async () => {
        const sut = new CompareFieldsValidation('someField', 'otherField');

        const input = {
            someField: 'any data',
            otherField: 'other data'
        };

        const validatorPromise = sut.validate(input);
        await expect(validatorPromise).rejects.toThrow(new InvalidParamError('otherField'));
    });

    test('should not throw if validation succeeds', async () => {
        const sut = new CompareFieldsValidation('someField', 'otherField');

        const input = {
            someField: 'any data',
            otherField: 'any data'
        };

        const validatorPromise = sut.validate(input);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
