import config from '@/main/config';

describe('Main config functions', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = { ...OLD_ENV };
    });

    test('should validate when running on test', () => {
        process.env.NODE_ENV = 'test';

        expect(config.isTest()).toBe(true);
        expect(config.isDev()).toBe(false);
        expect(config.isProduction()).toBe(false);
    });

    test('should validate when running on development', () => {
        process.env.NODE_ENV = 'dev';

        expect(config.isTest()).toBe(false);
        expect(config.isDev()).toBe(true);
        expect(config.isProduction()).toBe(false);
    });

    test('should validate when running on production', () => {
        process.env.NODE_ENV = 'production';

        expect(config.isTest()).toBe(false);
        expect(config.isDev()).toBe(false);
        expect(config.isProduction()).toBe(true);
    });

    test('should load correctly .env file when running on test', () => {
        process.env.NODE_ENV = 'test';

        const readdedFile = config.load();

        expect(readdedFile).toBe('.env.test');
    });

    test('should load correctly .env file when running on development', () => {
        process.env.NODE_ENV = 'dev';

        const readdedFile = config.load();

        expect(readdedFile).toBe('.env');
    });

    test('should load correctly .env file when running on production', () => {
        process.env.NODE_ENV = 'production';

        const readdedFile = config.load();

        expect(readdedFile).toBe('.env');
    });

    test('should return correct app secret key for token', () => {
        config.load();

        expect(config.getTokenSecretTokenKey()).toBe(process.env.APP_SECRET);
    });

    test('should return correct app secret key for refreshtoken', () => {
        config.load();

        expect(config.getTokenSecretRefreshTokenKey()).toBe(process.env.APP_SECRET_REFRESH);
    });

    test('should return correct expires time', () => {
        config.load();

        expect(config.getTokenSecretExpires()).toBe(parseInt(process.env.APP_SECRET_EXPIRES ?? '0'));
    });
});
