import { UserAttributes } from '@/domain/models/user/user';
import { UserRepository } from '@/infra/db/repository/user/user';
import { IdGenerator } from '@/infra/interfaces/idGenerator';

type SutTypes = {
    sut: UserRepository;
    idGeneratorStub: IdGenerator;
};

jest.mock('@/infra/db/model/user/userModel', () => ({
    async create(data: UserAttributes): Promise<UserAttributes> {
        return data;
    }
}));

const makeIdGenerator = (): IdGenerator => {
    class IdGeneratorStub implements IdGenerator {
        async generate(): Promise<string> {
            return 'valid uuid';
        }
    }

    return new IdGeneratorStub();
};

const makeSut = (): SutTypes => {
    const idGeneratorStub = makeIdGenerator();
    const sut = new UserRepository(idGeneratorStub);
    return { sut, idGeneratorStub };
};

describe('User Repository', () => {
    test('should call IdGenerator', async () => {
        const { sut, idGeneratorStub } = makeSut();
        const idGeneratorStubSpy = jest.spyOn(idGeneratorStub, 'generate');

        await sut.add({
            email: 'valid e-mail',
            name: 'valid name',
            password: 'valid password'
        });

        expect(idGeneratorStubSpy).toHaveBeenCalled();
    });

    test('should throw if IdGenerator throws', async () => {
        const { sut, idGeneratorStub } = makeSut();

        jest.spyOn(idGeneratorStub, 'generate').mockImplementation(() => {
            throw new Error('Test throw');
        });

        const addPromise = sut.add({
            email: 'valid e-mail',
            name: 'valid name',
            password: 'valid password'
        });

        await expect(addPromise).rejects.toThrow();
    });

    test('should return valid user attributes', async () => {
        const { sut } = makeSut();

        const userAttr = await sut.add({
            email: 'valid e-mail',
            name: 'valid name',
            password: 'valid password'
        });

        expect(userAttr).toEqual({
            id: 'valid uuid',
            email: 'valid e-mail',
            name: 'valid name',
            password: 'valid password'
        });
    });
});
