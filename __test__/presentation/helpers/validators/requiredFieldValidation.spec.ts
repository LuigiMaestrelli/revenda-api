import { MissingParamError } from '@/shared/errors';
import { RequiredFieldValidation } from '@/presentation/helpers/validators/requiredFieldValidation';

describe('RequiredField Validation', () => {
    test('should return a MissingParamError if validation fails', () => {
        const sut = new RequiredFieldValidation('someField');

        const input = {
            otherField: 'any data'
        };

        const error = sut.validate(input);
        expect(error).toEqual(new MissingParamError('someField'));
    });

    test('should not return if validation succeeds', () => {
        const sut = new RequiredFieldValidation('someField');

        const input = {
            someField: 'any data'
        };

        const error = sut.validate(input);
        expect(error).toBeFalsy();
    });
});
