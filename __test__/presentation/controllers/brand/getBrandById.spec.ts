import { IBrandRepository } from '@/domain/repository/brand/brand';
import { GetBrandByIdController } from '@/presentation/controllers/brand/getBrandById';
import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';
import { makeBrandRepositoryStub } from '@test/utils/mocks/repository/brand';

type SutTypes = {
    sut: GetBrandByIdController;
    validationStub: IValidation;
    brandRepositoryStub: IBrandRepository;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const brandRepositoryStub = makeBrandRepositoryStub();
    const sut = new GetBrandByIdController(validationStub, brandRepositoryStub);

    return {
        sut,
        brandRepositoryStub,
        validationStub
    };
};

describe('GetBrandById Controller', () => {
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

    test('should return 200 and valid user data', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.id).toBe('valid id');
    });

    test('should call FindById with correct value', async () => {
        const { sut, brandRepositoryStub } = makeSut();

        const findByIdSpy = jest.spyOn(brandRepositoryStub, 'findById');

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        await sut.handle(httpRequest);
        expect(findByIdSpy).toBeCalledWith('valid id');
    });

    test('should return 404 if no brand whas found', async () => {
        const { sut, brandRepositoryStub } = makeSut();

        jest.spyOn(brandRepositoryStub, 'findById').mockReturnValueOnce(null);

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const response = await sut.handle(httpRequest);
        expect(response.statusCode).toBe(404);
    });

    test('should return 500 if FindById throws', async () => {
        const { sut, brandRepositoryStub } = makeSut();

        jest.spyOn(brandRepositoryStub, 'findById').mockImplementationOnce(() => {
            throw new Error('Test throw');
        });

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const response = await sut.handle(httpRequest);
        expect(response.statusCode).toBe(500);
    });
});
