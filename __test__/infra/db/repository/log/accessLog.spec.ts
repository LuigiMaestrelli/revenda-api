import { AccessLogAttributes } from '@/domain/models/log/accessLog';
import { AccessLogRepository } from '@/infra/db/repository/log/accessLog';
import { IIdGenerator } from '@/infra/protocols/idGenerator';

type SutTypes = {
    sut: AccessLogRepository;
    idGeneratorStub: IIdGenerator;
};

jest.mock('@/infra/db/model/log/accessLogModel', () => ({
    async create(data: AccessLogAttributes): Promise<AccessLogAttributes> {
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
    const sut = new AccessLogRepository(idGeneratorStub);

    return { sut, idGeneratorStub };
};

describe('AccessLog Repository', () => {
    describe('addAuthorized', () => {
        test('should call IdGenerator', async () => {
            const { sut, idGeneratorStub } = makeSut();
            const idGeneratorStubSpy = jest.spyOn(idGeneratorStub, 'generate');

            await sut.addAuthorized({
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });

            expect(idGeneratorStubSpy).toHaveBeenCalled();
        });

        test('should throw if IdGenerator throws', async () => {
            const { sut, idGeneratorStub } = makeSut();
            jest.spyOn(idGeneratorStub, 'generate').mockImplementationOnce(() => {
                throw new Error('test error');
            });

            const addPromise = sut.addAuthorized({
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });

            await expect(addPromise).rejects.toThrow(new Error('test error'));
        });

        test('should return generated authorized access log', async () => {
            const { sut } = makeSut();

            const logAttr = await sut.addAuthorized({
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });

            expect(logAttr).toEqual({
                id: 'valid uuid',
                authorized: true,
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });
        });
    });

    describe('addUnauthorized', () => {
        test('should call IdGenerator', async () => {
            const { sut, idGeneratorStub } = makeSut();
            const idGeneratorStubSpy = jest.spyOn(idGeneratorStub, 'generate');

            await sut.addUnauthorized({
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });

            expect(idGeneratorStubSpy).toHaveBeenCalled();
        });

        test('should throw if IdGenerator throws', async () => {
            const { sut, idGeneratorStub } = makeSut();
            jest.spyOn(idGeneratorStub, 'generate').mockImplementationOnce(() => {
                throw new Error('test error');
            });

            const addPromise = sut.addUnauthorized({
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });

            await expect(addPromise).rejects.toThrow(new Error('test error'));
        });

        test('should return generated unauthorized access log', async () => {
            const { sut } = makeSut();

            const logAttr = await sut.addUnauthorized({
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });

            expect(logAttr).toEqual({
                id: 'valid uuid',
                authorized: false,
                email: 'valid email',
                ip: 'valid ip',
                userAgent: 'valid agent',
                hostName: 'valid host name',
                origin: 'valid origin',
                reason: 'valid reason'
            });
        });
    });
});
