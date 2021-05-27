import { IUserImageUseCase } from '@/domain/usecases/user/userImage';
import { GetUserImageController } from '@/presentation/controllers/user/getUserImage';
import { HttpRequest, IValidation } from '@/presentation/protocols';
import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { MissingParamError } from '@/shared/errors';

type SutTypes = {
    sut: GetUserImageController;
    validationStub: IValidation;
    userImageUseCaseStub: IUserImageUseCase;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeUserImageUseCase = (): IUserImageUseCase => {
    class UserImageUseCaseSub implements IUserImageUseCase {
        async setImage(imageData: CreateUserImageAttributes): Promise<UserImageAttributes> {
            return null;
        }

        async findById(id: string): Promise<UserImageAttributes> {
            return {
                id: 'valid id',
                image: null,
                imageSize: 100,
                mimetype: 'valid mime',
                name: 'valid name',
                miniature: null,
                miniatureSize: 100
            };
        }
    }

    return new UserImageUseCaseSub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const userImageUseCaseStub = makeUserImageUseCase();
    const sut = new GetUserImageController(validationStub, userImageUseCaseStub);

    return {
        sut,
        validationStub,
        userImageUseCaseStub
    };
};

describe('GetUserImage Controller', () => {
    test('should call validation with correct values', async () => {
        const { sut, validationStub } = makeSut();

        const validationSpy = jest.spyOn(validationStub, 'validate');

        const httpRequest: HttpRequest = {
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

        const httpRequest: HttpRequest = {
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

        const httpRequest: HttpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });

    test('should call findById with correct values', async () => {
        const { sut, userImageUseCaseStub } = makeSut();

        const updateSpy = jest.spyOn(userImageUseCaseStub, 'findById');

        const httpRequest: HttpRequest = {
            params: {
                id: 'valid id'
            }
        };

        await sut.handle(httpRequest);
        expect(updateSpy).toBeCalledWith('valid id');
    });

    test('should return 500 if findById throws', async () => {
        const { sut, userImageUseCaseStub } = makeSut();

        jest.spyOn(userImageUseCaseStub, 'findById').mockImplementation(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpRequest: HttpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body.message).toBe('Test throw');
    });
});
