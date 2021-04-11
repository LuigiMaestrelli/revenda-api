import databaseCfg from '@/main/config/database';
import config from '@/main/config';

describe('Database config files', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = { ...OLD_ENV };
    });

    test('should throw exception when no port number is configured', () => {
        config.load();

        process.env.DB_PORT = '';

        expect(databaseCfg.load).toThrow('Database port number not set');
    });

    test('should throw exception when no host is configured', () => {
        config.load();

        process.env.DB_HOST = '';

        expect(databaseCfg.load).toThrow('Database host not set');
    });

    test('should throw exception when no user is configured', () => {
        config.load();

        process.env.DB_USER = '';

        expect(databaseCfg.load).toThrow('Database user not set');
    });

    test('should throw exception when no passwordr is configured', () => {
        config.load();

        process.env.DB_PASS = '';

        expect(databaseCfg.load).toThrow('Database password not set');
    });

    test('should create right config options', () => {
        config.load();

        const dbConfig = databaseCfg.load();

        expect(dbConfig.port).toEqual(parseInt(process.env.DB_PORT ?? '', 10));
        expect(dbConfig.host).toEqual(process.env.DB_HOST);
        expect(dbConfig.username).toEqual(process.env.DB_USER);
        expect(dbConfig.password).toEqual(process.env.DB_PASS);
        expect(dbConfig.database).toEqual(process.env.DB_NAME);
        expect(dbConfig.dialect).toEqual('postgres');
        expect(dbConfig.timezone).toEqual('+00:00');

        expect(dbConfig.define?.timestamps).toEqual(true);
        expect(dbConfig.define?.charset).toEqual('utf8');
    });
});
