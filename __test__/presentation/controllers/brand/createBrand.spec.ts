import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';
import { CreateBrandController } from '@/presentation/controllers/brand/createBrand';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';
import { makeBrandUseCaseStub } from '@test/utils/mocks/application/brand';

type SutTypes = {
    sut: CreateBrandController;
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
    const sut = new CreateBrandController(validationStub, brandUseCaseStub);

    return {
        sut,
        validationStub,
        brandUseCaseStub
    };
};

describe('CreateBrand Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();

        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            body: {
                description: 'valid description'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            body: {
                description: 'valid description'
            }
        });
    });

    test('should return 400 if validation throws', async () => {
        const { sut, validationStub } = makeSut();

        jest.spyOn(validationStub, 'validate').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new MissingParamError('Test throw')));
        });

        const httpRequest = {
            body: {
                description: 'invalid description'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body.message).toBe('Missing param: Test throw');
    });

    test('should return 200 if valid data is sent', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                description: 'valid description'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should call Add with correct values', async () => {
        const { sut, brandUseCaseStub } = makeSut();

        const activeSpy = jest.spyOn(brandUseCaseStub, 'add');

        const httpRequest = {
            body: {
                description: 'valid description'
            }
        };

        await sut.handle(httpRequest);
        expect(activeSpy).toBeCalledWith({
            description: 'valid description'
        });
    });

    test('should return 500 if Add throws', async () => {
        const { sut, brandUseCaseStub } = makeSut();

        jest.spyOn(brandUseCaseStub, 'add').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            body: {
                description: 'valid description'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });
});
