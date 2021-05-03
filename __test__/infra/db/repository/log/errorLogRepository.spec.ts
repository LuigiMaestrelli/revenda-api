import { ErrorLogAttributes } from '@/domain/models/log/errorLog';
import { ErrorLogRepository } from '@/infra/db/repository/log/errorLog';
import { IIdGenerator } from '@/infra/protocols/idGenerator';

type SutTypes = {
    sut: ErrorLogRepository;
    idGeneratorStub: IIdGenerator;
};

jest.mock('@/infra/db/model/log/errorLogModel', () => ({
    async create(data: ErrorLogAttributes): Promise<ErrorLogAttributes> {
        return data;
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
    const sut = new ErrorLogRepository(idGeneratorStub);

    return { sut, idGeneratorStub };
};

describe('ErrorLog Repository', () => {
    test('should call IdGenerator', async () => {
        const { sut, idGeneratorStub } = makeSut();
        const idGeneratorStubSpy = jest.spyOn(idGeneratorStub, 'generate');

        await sut.add({
            location: 'unit test',
            message: 'this is a test',
            stack: ''
        });

        expect(idGeneratorStubSpy).toHaveBeenCalled();
    });

    test('should throw if IdGenerator throws', async () => {
        const { sut, idGeneratorStub } = makeSut();
        jest.spyOn(idGeneratorStub, 'generate').mockImplementationOnce(() => {
            throw new Error('test error');
        });

        const addPromise = sut.add({
            location: 'unit test',
            message: 'this is a test',
            stack: ''
        });

        await expect(addPromise).rejects.toThrow(new Error('test error'));
    });

    test('should return generated error log', async () => {
        const { sut } = makeSut();

        const logAttr = await sut.add({ location: 'unit test', message: 'this is a test', stack: 'stack error' });

        expect(logAttr).toEqual({
            id: 'valid uuid',
            location: 'unit test',
            message: 'this is a test',
            stack: 'stack error'
        });
    });
});
