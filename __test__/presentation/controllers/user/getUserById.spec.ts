import { GetUserByIdController } from '@/presentation/controllers/user/getUserById';
import { IFindUserByIdRepository } from '@/domain/repository/user/user';
import { UserAttributes } from '@/domain/models/user/user';
import { IValidation } from '@/presentation/protocols';
import { MissingParamError } from '@/shared/errors';

type SutTypes = {
    sut: GetUserByIdController;
    validationStub: IValidation;
    findUserByIdRepositoryStub: IFindUserByIdRepository;
};

const makeValidation = (): IValidation => {
    class ValidationStub implements IValidation {
        async validate(input: any): Promise<void> {}
    }

    return new ValidationStub();
};

const makeFindUserByIdRepository = (): IFindUserByIdRepository => {
    class FindUserByIdRepositoryStub implements IFindUserByIdRepository {
        async findById(id: string): Promise<UserAttributes> {
            return {
                id: id,
                name: 'valid name',
                email: 'valid email',
                password: 'valid password',
                active: true
            };
        }
    }

    return new FindUserByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
    const validationStub = makeValidation();
    const findUserByIdRepositoryStub = makeFindUserByIdRepository();
    const sut = new GetUserByIdController(validationStub, findUserByIdRepositoryStub);

    return {
        sut,
        findUserByIdRepositoryStub,
        validationStub
    };
};

describe('GetUserById Controller', () => {
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
                id: 'xxxx-xxxx-xxxx'
            }
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.id).toBe('xxxx-xxxx-xxxx');
    });

    test('should call FindUserById with correct value', async () => {
        const { sut, findUserByIdRepositoryStub } = makeSut();

        const addSpy = jest.spyOn(findUserByIdRepositoryStub, 'findById');

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        await sut.handle(httpRequest);
        expect(addSpy).toBeCalledWith('valid id');
    });

    test('should return 404 if no user whas found', async () => {
        const { sut, findUserByIdRepositoryStub } = makeSut();

        jest.spyOn(findUserByIdRepositoryStub, 'findById').mockReturnValueOnce(null);

        const httpRequest = {
            params: {
                id: 'valid id'
            }
        };

        const response = await sut.handle(httpRequest);
        expect(response.statusCode).toBe(404);
    });

    test('should return 500 if FindUserById throws', async () => {
        const { sut, findUserByIdRepositoryStub } = makeSut();

        jest.spyOn(findUserByIdRepositoryStub, 'findById').mockImplementationOnce(() => {
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
