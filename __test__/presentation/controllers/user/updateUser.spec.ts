import { UpdateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import { IUpdateUser } from '@/domain/usecases/user/user';
import { UpdateUserController } from '@/presentation/controllers/user/updateUser';
import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';

type SutTypes = {
    sut: UpdateUserController;
    validationStub: IValidation;
    updateUserStub: IUpdateUser;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeUpdateUser = (): IUpdateUser => {
    class UpdateUserStub implements IUpdateUser {
        async update(id: string, userData: UpdateUserAttributes): Promise<UserAttributes> {
            return {
                id: id,
                email: 'valid email',
                password: 'hashed password',
                ...userData
            };
        }
    }

    return new UpdateUserStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const updateUserStub = makeUpdateUser();
    const sut = new UpdateUserController(validationStub, updateUserStub);

    return {
        sut,
        validationStub,
        updateUserStub
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
        const { sut, updateUserStub } = makeSut();

        const updateSpy = jest.spyOn(updateUserStub, 'update');

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
        const { sut, updateUserStub } = makeSut();

        jest.spyOn(updateUserStub, 'update').mockImplementation(async () => {
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
});
