import faker from 'faker';
import { AccessLogRepository } from '@/infra/db/repository/log/accessLog';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { truncate } from '@test/utils/database';

type SutTypes = {
    sut: AccessLogRepository;
    idGeneratorStub: IIdGenerator;
};

const makeIdGenerator = (): IIdGenerator => {
    return new UUIDAdapter();
};

const makeSut = (): SutTypes => {
    const idGeneratorStub = makeIdGenerator();
    const sut = new AccessLogRepository(idGeneratorStub);

    return { sut, idGeneratorStub };
};

describe('AccessLog Repository', () => {
    beforeEach(async () => {
        await truncate();
    });

    test('should create access log', async () => {
        const { sut } = makeSut();

        const accessLog = await sut.add({
            authorized: true,
            email: faker.internet.email(),
            ip: faker.internet.ip(),
            userAgent: 'valid agent',
            hostName: 'valid host name',
            origin: 'valid origin',
            reason: 'valid reason'
        });

        expect(accessLog.id).toBeTruthy();
    });
});
