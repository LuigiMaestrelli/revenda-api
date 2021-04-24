import { JwtAdapter } from '@/infra/adapters/cryptography/jwtAdapter';

const SECRET_TOKEN_KEY = 'xxasdasd';
const SECRET_REFRESHTOKEN_KEY = 'q234ewrw849';
const EXPIRES_IN = '2';

const makeSut = (): JwtAdapter => {
    return new JwtAdapter(SECRET_TOKEN_KEY, SECRET_REFRESHTOKEN_KEY, parseInt(EXPIRES_IN));
};

describe('JSONWebToken Adapter', () => {
    test('should generate a valid AuhtorizationData', async () => {
        const sut = makeSut();

        const payload = { userId: 'xxxx' };
        const authData = await sut.sign(payload);

        expect(authData).toBeTruthy();
        expect(authData.token).toBeTruthy();
        expect(authData.refreshToken).toBeTruthy();
        expect(authData.expiresIn).toBe(7200);
    });

    test('should validade and decode a valid token', async () => {
        const sut = makeSut();

        const payload = { userId: 'xxxx' };
        const authData = await sut.sign(payload);

        const tokenReturn = await sut.validateToken(authData.token);
        expect(tokenReturn).toEqual({ userId: 'xxxx' });
    });

    test('should validade and decode a valid refreshtoken', async () => {
        const sut = makeSut();

        const payload = { userId: 'xxxx' };
        const authData = await sut.sign(payload);

        const refreshTokenReturn = await sut.validateRefreshToken(authData.refreshToken);
        expect(refreshTokenReturn).toEqual({ userId: 'xxxx' });
    });

    test('should throw an error if decoding an invalid token', async () => {
        const sut = makeSut();

        const validatePromise = sut.validateToken('aosidjaoisdjaoidsjoiajsidoj');
        await expect(validatePromise).rejects.toThrow();
    });

    test('should throw an error if decoding an invalid refreshtoken', async () => {
        const sut = makeSut();

        const validatePromise = sut.validateRefreshToken('fhs0d9fs8dfj98duj');
        await expect(validatePromise).rejects.toThrow();
    });
});
