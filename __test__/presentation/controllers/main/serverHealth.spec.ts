import { ServerHealthController } from '@/presentation/controllers/main/serverHealth';

type SutTypes = {
    sut: ServerHealthController;
};

const makeSut = (): SutTypes => {
    const sut = new ServerHealthController();

    return { sut };
};

describe('ServerHealth Controller', () => {
    test('should return 200 ', async () => {
        const { sut } = makeSut();
        const httpRequest = {};

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.message).toBe('OK');
    });

    test('should return 500 on server error', async () => {
        const { sut } = makeSut();
        const httpRequest = {};

        jest.spyOn(sut, 'getProcessUpTime').mockImplementationOnce(() => {
            throw new Error('Test throw');
        });

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
    });
});
