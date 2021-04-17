import { MissingParamError } from '@/shared/errors';
import { Validation } from '@/presentation/interfaces/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validationComposite';

interface SutTypes {
    validationStubs: Validation[];
    sut: ValidationComposite;
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error | null {
            return null;
        }
    }

    return new ValidationStub();
};

const makeSut = (): SutTypes => {
    const validationStubs = [makeValidation(), makeValidation()];
    const sut = new ValidationComposite(validationStubs);

    return {
        sut,
        validationStubs
    };
};

describe('Validation Composite', () => {
    test('should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut();
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('someField'));

        const input = {
            field: 'any value'
        };

        const error = sut.validate(input);
        expect(error).toEqual(new MissingParamError('someField'));
    });

    test('should return the error if more than one validation fails', () => {
        const { sut, validationStubs } = makeSut();
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('someField'));

        const input = {
            field: 'any value'
        };

        const error = sut.validate(input);
        expect(error).toEqual(new Error());
    });

    test('should not return if validation succeeds', () => {
        const { sut } = makeSut();
        const input = {
            field: 'any value'
        };

        const error = sut.validate(input);
        expect(error).toBeFalsy();
    });
});
