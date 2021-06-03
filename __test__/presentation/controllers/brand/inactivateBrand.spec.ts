import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';
import { makeBrandUseCaseStub } from '@test/utils/mocks/application/brand';
import { InactivateBrandController } from '@/presentation/controllers/brand/inactivateBrand';

type SutTypes = {
    sut: InactivateBrandController;
    validationStub: IValidation;
    brandUseCaseStub: IBrandUseCase;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const brandUseCaseStub = makeBrandUseCaseStub();
    const sut = new InactivateBrandController(validationStub, brandUseCaseStub);

    return {
        sut,
        validationStub,
        brandUseCaseStub
    };
};

describe('InactivateBrand Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();

        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            params: {
                id: 'valid id'
            }
        });
    });

    test('should return 400 if validation throws', async () => {
        const { sut, validationStub } = makeSut();

        jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new MissingParamError('Test throw')));
        });

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toBe('Missing param: Test throw');
    });

    test('should return 200 if valid data is sent', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should call Inactive with correct values', async () => {
        const { sut, brandUseCaseStub } = makeSut();

        const inactiveSpy = jest.spyOn(brandUseCaseStub, 'inactive');

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        await sut.handle(httpRequest);
        expect(inactiveSpy).toBeCalledWith('valid id');
    });

    test('should return 500 if Inactive throws', async () => {
        const { sut, brandUseCaseStub } = makeSut();

        jest.spyOn(brandUseCaseStub, 'inactive').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });
});
