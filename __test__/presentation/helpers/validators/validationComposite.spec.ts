import { MissingParamError } from '@/shared/errors';
import { IValidation } from '@/presentation/protocols/validation';
import { ValidationComposite } from '@/presentation/helpers/validators/validationComposite';

interface SutTypes {
    validationStub: IValidation[];
    sut: ValidationComposite;
}

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeSut = (): SutTypes => {
    const validationStub = [makeValidation(), makeValidation()];
    const sut = new ValidationComposite(validationStub);

    return {
        sut,
        validationStub
    };
};

describe('Validation Composite', () => {
    test('should thrown an error if any validation fails', async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub[0], 'validate').mockImplementationOnce(() => {
            throw new MissingParamError('someField');
        });

        const httpRequest = {
            body: {
                field: 'any value'
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new MissingParamError('someField'));
    });

    test('should return the error if more than one validation fails', async () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub[0], 'validate').mockImplementationOnce(() => {
            throw new Error();
        });
        jest.spyOn(validationStub[1], 'validate').mockImplementationOnce(() => {
            throw new MissingParamError('someField');
        });

        const httpRequest = {
            body: {
                field: 'any value'
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).rejects.toThrow(new Error());
    });

    test('should not throw if validation succeeds', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                field: 'any value'
            }
        };

        const validatorPromise = sut.validate(httpRequest);
        await expect(validatorPromise).resolves.not.toThrow();
    });
});
