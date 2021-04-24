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
});
