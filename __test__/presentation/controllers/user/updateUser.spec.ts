import { IUserUseCase } from '@/domain/usecases/user/user';
import { UpdateUserController } from '@/presentation/controllers/user/updateUser';
import { IValidation } from '@/presentation/protocols';
import { IObjectManipulation } from '@/infra/protocols/objectManipulation';
import { MissingParamError } from '@/shared/errors';
import { makeUserUseCaseStub } from '@test/utils/mocks/application/user';

type SutTypes = {
    sut: UpdateUserController;
    validationStub: IValidation;
    userUseCaseStub: IUserUseCase;
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
            delete object.password;
            return object;
        }
    }

    return new ObjectManipulationSub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const userUseCaseStub = makeUserUseCaseStub();
    const objectManipulationSub = makeObjectManipulation();
    const sut = new UpdateUserController(validationStub, objectManipulationSub, userUseCaseStub);

    return {
        sut,
        validationStub,
        userUseCaseStub,
        objectManipulationSub
    };
};

describe('UpdateUser Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();

        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                name: 'new name'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            params: {
                id: 'valid id'
            },
            body: {
                name: 'new name'
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
                name: 'invalid name'
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
                name: 'valid name'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should call UpdateUser with correct values', async () => {
        const { sut, userUseCaseStub } = makeSut();

        const updateSpy = jest.spyOn(userUseCaseStub, 'update');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                name: 'new name'
            }
        };

        await sut.handle(httpRequest);
        expect(updateSpy).toBeCalledWith('valid id', {
            name: 'new name'
        });
    });

    test('should return 500 if UpdateUser throws', async () => {
        const { sut, userUseCaseStub } = makeSut();

        jest.spyOn(userUseCaseStub, 'update').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                name: 'any name'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });

    test('should return updated user data', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                name: 'valid name'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.body.id).toBe('valid id');
        expect(httpResponse.body.name).toBe('valid name');
    });

    test('should call ObjectManipulation with correct values', async () => {
        const { sut, objectManipulationSub } = makeSut();

        const filterAllowedPropsSpy = jest.spyOn(objectManipulationSub, 'filterAllowedProps');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                name: 'new name'
            }
        };

        await sut.handle(httpRequest);

        expect(filterAllowedPropsSpy).toBeCalledWith(
            {
                name: 'new name'
            },
            ['name']
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
                name: 'invalid name'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });

    test('should call UpdateUser with filtered body properties', async () => {
        const { sut, userUseCaseStub } = makeSut();

        const updateSpy = jest.spyOn(userUseCaseStub, 'update');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                name: 'new name',
                password: 'xxxx'
            }
        };

        await sut.handle(httpRequest);
        expect(updateSpy).toBeCalledWith('valid id', {
            name: 'new name'
        });
    });
});
