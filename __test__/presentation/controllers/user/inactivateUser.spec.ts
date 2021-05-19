import { makeUserUseCaseStub } from '@/../__test__/utils/mocks/application/user';
import { IUserUseCase } from '@/domain/usecases/user/user';
import { InactivateUserController } from '@/presentation/controllers/user/inactivateUser';
import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';

type SutTypes = {
    sut: InactivateUserController;
    validationStub: IValidation;
    userUseCaseStub: IUserUseCase;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const userUseCaseStub = makeUserUseCaseStub();
    const sut = new InactivateUserController(validationStub, userUseCaseStub);

    return {
        sut,
        validationStub,
        userUseCaseStub
    };
};

describe('InactivateUser Controller', () => {
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

    test('should call InactiveUser with correct values', async () => {
        const { sut, userUseCaseStub } = makeSut();

        const activeSpy = jest.spyOn(userUseCaseStub, 'inactive');

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        await sut.handle(httpRequest);
        expect(activeSpy).toBeCalledWith('valid id');
    });

    test('should return 500 if InactiveUser throws', async () => {
        const { sut, userUseCaseStub } = makeSut();

        jest.spyOn(userUseCaseStub, 'inactive').mockImplementation(async () => {
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
