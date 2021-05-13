import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';

const makeSut = (): UUIDAdapter => {
    return new UUIDAdapter();
};

const validationRegex = /^[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-4[A-Za-z0-9]{3}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}$/;

const isUUIDV4Valid = (arg: string): boolean => {
    return validationRegex.test(arg);
};

describe('UUID Adapter', () => {
    test('should generate a valid uuid', async () => {
        const sut = makeSut();

        const uuid = await sut.generate();

        expect(uuid).toBeTruthy();
        expect(isUUIDV4Valid(uuid)).toBe(true);
    });
});
