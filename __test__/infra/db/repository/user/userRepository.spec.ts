import { UserAttributes } from '@/domain/models/user/user';
import { UserRepository } from '@/infra/db/repository/user/userRepository';
import { IIdGenerator } from '@/infra/protocols/idGenerator';

type SutTypes = {
    sut: UserRepository;
    idGeneratorStub: IIdGenerator;
};

jest.mock('@/infra/db/model/user/userModel', () => ({
    async create(data: UserAttributes): Promise<UserAttributes> {
        return data;
    },

    async findOne(): Promise<UserAttributes> {
        return {
            id: 'valid uuid',
            email: 'valid e-mail',
            name: 'valid name',
            password: 'valid password'
        };
    },

    async findByPk(): Promise<UserAttributes> {
        return {
            id: 'valid uuid',
            email: 'valid e-mail',
            name: 'valid name',
            password: 'valid password'
        };
    }
}));

const makeIdGenerator = (): IIdGenerator => {
    class IdGeneratorStub implements IIdGenerator {
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
    describe('Add user', () => {
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

    describe('Find user by e-mail', () => {
        test('should find user by e-mail and return', async () => {
            const { sut } = makeSut();

            const user = await sut.findUserByEmail('valid email');

            expect(user).toBeTruthy();
            expect(user?.id).toEqual('valid uuid');
        });
    });

    describe('Find user by id', () => {
        test('should find user by id and return', async () => {
            const { sut } = makeSut();

            const user = await sut.findById('valid id');

            expect(user).toBeTruthy();
            expect(user?.id).toEqual('valid uuid');
        });
    });
});
