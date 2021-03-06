import faker from 'faker';
import { ErrorLogRepository } from '@/infra/db/repository/log/errorLog';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { truncate } from '@test/utils/database';

type SutTypes = {
    sut: ErrorLogRepository;
    idGeneratorStub: IIdGenerator;
};

const makeIdGenerator = (): IIdGenerator => {
    return new UUIDAdapter();
};

const makeSut = (): SutTypes => {
    const idGeneratorStub = makeIdGenerator();
    const sut = new ErrorLogRepository(idGeneratorStub);

    return { sut, idGeneratorStub };
};

describe('ErrorLog Repository', () => {
    beforeEach(async () => {
        await truncate();
    });

    test('should create error log', async () => {
        const { sut } = makeSut();

        const errorLog = await sut.add({
            location: faker.random.alpha({ count: 100 }),
            message: faker.lorem.lines(1),
            stack: faker.lorem.lines(4)
        });

        expect(errorLog.id).toBeTruthy();
    });
});
