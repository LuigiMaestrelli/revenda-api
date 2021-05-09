import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/adapters/cryptography/bcryptAdapter';

jest.mock('bcrypt', () => ({
    async hash(): Promise<String> {
        return await new Promise(resolve => resolve('hash'));
    },

    async compare(): Promise<boolean> {
        return await new Promise(resolve => resolve(true));
    }
}));

const SALT = 12;

const makeSut = (): BcryptAdapter => {
    return new BcryptAdapter();
};

describe('Bcrypt Adapter', () => {
    describe('Hash function', () => {
        test('should call hash with correct values', async () => {
            const sut = makeSut();
            const hashSpy = jest.spyOn(bcrypt, 'hash');

            await sut.hash('any_value');
            expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
        });

        test('should return a valid hash on hash success', async () => {
            const sut = makeSut();
            const hash = await sut.hash('any_value');

            expect(hash).toBe('hash');
        });

        test('should throw if bcrypt throws on hash', async () => {
            const sut = makeSut();
            jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
                throw new Error('Some error');
            });

            const promiseHash = sut.hash('any_value');
            await expect(promiseHash).rejects.toThrow();
        });
    });

    describe('Compare function', () => {
        test('should call compare with correct values', async () => {
            const sut = makeSut();
            const compareSpy = jest.spyOn(bcrypt, 'compare');

            await sut.compare('any_value', 'any_hash');
            expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
        });

        test('should return a true when compre succeeds', async () => {
            const sut = makeSut();
            const hash = await sut.compare('any_value', 'any_hash');
            expect(hash).toBe(true);
        });

        test('should throw if bcrypt throws on compare', async () => {
            const sut = makeSut();
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
                throw new Error('Some error');
            });

            const promiseCompare = sut.compare('any_value', 'any_hash');
            await expect(promiseCompare).rejects.toThrow();
        });

        test('should return a false when compare fails', async () => {
            const sut = makeSut();
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
                return false;
            });

            const result = await sut.compare('any_value', 'any_hash');
            expect(result).toBe(false);
        });
    });
});
