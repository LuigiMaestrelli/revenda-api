import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';

const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter();
};

describe('Bcrypt Adapter', () => {
    test('should generate a valid hash', async () => {
        const sut = makeSut();

        const data = 'some valid data';
        const hash = await sut.hash(data);

        expect(hash).toBeTruthy();
    });

    test('should return true when comparing a valid hash', async () => {
        const sut = makeSut();

        const data = 'some valid data';
        const hash = await sut.hash(data);

        expect(hash).toBeTruthy();

        const isValid = await sut.compare(data, hash);
        expect(isValid).toBe(true);
    });

    test('should return false when comparing a invalid hash', async () => {
        const sut = makeSut();

        const hash = await sut.hash('some data');

        expect(hash).toBeTruthy();

        const isValid = await sut.compare('some other data', hash);
        expect(isValid).toBe(false);
    });
});
