import { RootController } from '@/presentation/controllers/main/root';

type SutTypes = {
    sut: RootController;
};

const makeSut = (): SutTypes => {
    const sut = new RootController();

    return { sut };
};

describe('Root Controller', () => {
    test('should return 200 ', async () => {
        const { sut } = makeSut();
        const httpRequest = {};

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });
});
