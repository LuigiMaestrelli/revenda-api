import { InvalidParamError } from '@/shared/errors';
import { CompareFieldsValidation } from '@/presentation/helpers/validators/compareFieldsValidation';

describe('CompareFields Validation', () => {
    test('should return a InvalidParamError if validation fails', () => {
        const sut = new CompareFieldsValidation('someField', 'otherField');

        const input = {
            someField: 'any data',
            otherField: 'other data'
        };

        const error = sut.validate(input);
        expect(error).toEqual(new InvalidParamError('otherField'));
    });

    test('should not return if validation succeeds', () => {
        const sut = new CompareFieldsValidation('someField', 'otherField');

        const input = {
            someField: 'any data',
            otherField: 'any data'
        };

        const error = sut.validate(input);
        expect(error).toBeFalsy();
    });
});
