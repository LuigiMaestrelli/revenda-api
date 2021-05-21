import { makeUserUseCaseStub } from '@test/utils/mocks/application/user';
import { IUserUseCase } from '@/domain/usecases/user/user';
import { ChangeUserPasswordController } from '@/presentation/controllers/user/changeUserPassword';
import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';

type SutTypes = {
    sut: ChangeUserPasswordController;
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
    const sut = new ChangeUserPasswordController(validationStub, userUseCaseStub);

    return {
        sut,
        validationStub,
        userUseCaseStub
    };
};

describe('ChangeUserPassword Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();

        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                currentPassword: 'current password',
                newPassword: 'new password'
            }
        };

        await sut.handle(httpRequest);

        expect(validationSpy).toBeCalledWith({
            params: {
                id: 'valid id'
            },
            body: {
                currentPassword: 'current password',
                newPassword: 'new password'
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
                currentPassword: 'current password',
                newPassword: 'new password'
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
                currentPassword: 'current password',
                newPassword: 'new password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should call ChangePassword with correct values', async () => {
        const { sut, userUseCaseStub } = makeSut();

        const changePasswordSpy = jest.spyOn(userUseCaseStub, 'changePassword');

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                currentPassword: 'current password',
                newPassword: 'new password'
            }
        };

        await sut.handle(httpRequest);
        expect(changePasswordSpy).toBeCalledWith('valid id', {
            currentPassword: 'current password',
            newPassword: 'new password'
        });
    });

    test('should return 500 if ChangePassword throws', async () => {
        const { sut, userUseCaseStub } = makeSut();

        jest.spyOn(userUseCaseStub, 'changePassword').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest = {
            params: {
                id: 'valid id'
            },
            body: {
                currentPassword: 'current password',
                newPassword: 'new password'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });
});
