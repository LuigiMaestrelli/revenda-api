import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/adapters/cryptography/jwtAdapter';

jest.mock('jsonwebtoken', () => ({
    sign(): String {
        return 'token';
    }
}));

const SECRET_TOKEN_KEY = 'xxasdasd';
const SECRET_REFRESHTOKEN_KEY = 'q234ewrw849';
const EXPIRES_IN = '2';

const makeSut = (): JwtAdapter => {
    return new JwtAdapter(SECRET_TOKEN_KEY, SECRET_REFRESHTOKEN_KEY, parseInt(EXPIRES_IN));
};

describe('JSONWebToken Adapter', () => {
    test('should call jsonwebtoken with correct values', async () => {
        const sut = makeSut();
        const signSpy = jest.spyOn(jwt, 'sign');

        await sut.sign({ userId: 'valid id' });
        expect(signSpy).toHaveBeenCalledWith({ userId: 'valid id' }, SECRET_TOKEN_KEY, {
            algorithm: 'HS256',
            expiresIn: `${EXPIRES_IN}h`
        });
    });

    test('should return valid token, refreshtoken and expiration', async () => {
        const sut = makeSut();

        const expiresInHours = parseInt(EXPIRES_IN);
        const expiresInSeconds = expiresInHours * 3600;

        const result = await sut.sign({ userId: 'valid id' });
        expect(result).toEqual({ token: 'token', refreshToken: 'token', expiresIn: expiresInSeconds });
    });

    test('should throw if jsonwebtoken throws', async () => {
        const sut = makeSut();
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            throw new Error('Test throw');
        });

        const signPromise = sut.sign({ userId: 'valid id' });
        await expect(signPromise).rejects.toThrow(new Error('Test throw'));
    });
});