import { IValidation } from '@/presentation/protocols';
import { IObjectManipulation } from '@/infra/protocols/objectManipulation';
import { MissingParamError } from '@/shared/errors';
import { makeBrandUseCaseStub } from '@test/utils/mocks/application/brand';
import { UpdateBrandController } from '@/presentation/controllers/brand/updateBrand';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';

type SutTypes = {
    sut: UpdateBrandController;
    validationStub: IValidation;
    brandUseCaseStub: IBrandUseCase;
    objectManipulationSub: IObjectManipulation;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeObjectManipulation = (): IObjectManipulation => {
    class ObjectManipulationSub implements IObjectManipulation {
        filterAllowedProps(object: any, allowedProps: string[]): any {
            delete object.active;
            return object;
        }
    }

    return new ObjectManipulationSub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const brandUseCaseStub = makeBrandUseCaseStub();
    const objectManipulationSub = makeObjectManipulation();
    const sut = new UpdateBrandController(validationStub, objectManipulationSub, brandUseCaseStub);

    return {
        sut,
        validationStub,
        brandUseCaseStub,
        objectManipulationSub
    };
};

describe('UpdateBrand Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();

        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                description: 'new description'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            params: {
                id: 'valid id'
            },
            body: {
                description: 'new description'
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
            },
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
            params: {
                id: 'valid id'
            },
            body: {
                description: 'valid description'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should call Update with correct values', async () => {
        const { sut, brandUseCaseStub } = makeSut();

        const updateSpy = jest.spyOn(brandUseCaseStub, 'update');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                description: 'new description'
            }
        };

        await sut.handle(httpRequest);
        expect(updateSpy).toBeCalledWith('valid id', {
            description: 'new description'
        });
    });

    test('should return 500 if Update throws', async () => {
        const { sut, brandUseCaseStub } = makeSut();

        jest.spyOn(brandUseCaseStub, 'update').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                description: 'any description'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });

    test('should return updated brand data', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                description: 'valid description'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.body.id).toBe('valid id');
        expect(httpResponse.body.description).toBe('valid description');
    });

    test('should call ObjectManipulation with correct values', async () => {
        const { sut, objectManipulationSub } = makeSut();

        const filterAllowedPropsSpy = jest.spyOn(objectManipulationSub, 'filterAllowedProps');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                description: 'new description'
            }
        };

        await sut.handle(httpRequest);

        expect(filterAllowedPropsSpy).toBeCalledWith(
            {
                description: 'new description'
            },
            ['description']
        );
    });

    test('should return 500 if ObjectManipulation throws', async () => {
        const { sut, objectManipulationSub } = makeSut();

        jest.spyOn(objectManipulationSub, 'filterAllowedProps').mockImplementation(() => {
            throw new Error('Test throw');
        });

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                description: 'invalid description'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });

    test('should call Update with filtered body properties', async () => {
        const { sut, brandUseCaseStub } = makeSut();

        const updateSpy = jest.spyOn(brandUseCaseStub, 'update');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                description: 'new description',
                active: false
            }
        };

        await sut.handle(httpRequest);
        expect(updateSpy).toBeCalledWith('valid id', {
            description: 'new description'
        });
    });
});
