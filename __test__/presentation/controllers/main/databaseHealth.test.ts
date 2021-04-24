import { DatabaseHealthController } from '@/presentation/controllers/main/databaseHealth';

type SutTypes = {
    sut: DatabaseHealthController;
};

const makeSut = (): SutTypes => {
    const sut = new DatabaseHealthController();

    return { sut };
};

describe('DatabaseHealth Controller', () => {
    test('should return 200', async () => {
        const { sut } = makeSut();
        const httpRequest = {};

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
        expect(httpResponse.body.status).toBe('Database connected');
    });

    test('should return 500 on database error', async () => {
        const { sut } = makeSut();
        const httpRequest = {};

        jest.spyOn(sut, 'connectDatabase').mockImplementationOnce(async () => {
            return await new Promise((resolve, reject) => reject(new Error('Test throw')));
        });

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
    });
});
