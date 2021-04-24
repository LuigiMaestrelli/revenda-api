import { AuthHealthController } from '@/presentation/controllers/main/authHealth';

type SutTypes = {
    sut: AuthHealthController;
};

const makeSut = (): SutTypes => {
    const sut = new AuthHealthController();

    return { sut };
};

describe('AuthHealth Controller', () => {
    test('should return 200', async () => {
        const { sut } = makeSut();
        const httpRequest = {};

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(200);
    });
});
