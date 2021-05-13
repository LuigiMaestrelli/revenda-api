import uuid from 'uuid';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';

jest.mock('uuid', () => ({
    v4: () => {
        return 'valid uuid v4';
    }
}));

const makeSut = (): UUIDAdapter => {
    return new UUIDAdapter();
};

describe('UUID Adapter', () => {
    test('should call uuid', async () => {
        const sut = makeSut();
        const v4Spy = jest.spyOn(uuid, 'v4');

        await sut.generate();
        expect(v4Spy).toBeCalled();
    });

    test('should return generated uuid', async () => {
        const sut = makeSut();

        const uuid = await sut.generate();
        expect(uuid).toBe('valid uuid v4');
    });

    test('should throw if uuid throws', async () => {
        const sut = makeSut();

        jest.spyOn(uuid, 'v4').mockImplementationOnce(() => {
            throw new Error('Test throw');
        });

        const generatePromise = sut.generate();
        await expect(generatePromise).rejects.toThrow(new Error('Test throw'));
    });
});
