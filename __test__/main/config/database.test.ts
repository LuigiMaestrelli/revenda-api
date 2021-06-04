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
        jest.spyOn(config, 'getDatabaseConfig').mockReturnValueOnce({
            username: 'valid username',
            password: 'valid password',
            database: 'valid database',
            host: 'valid host',
            dialect: 'valid dialect',
            port: null
        });

        expect(databaseCfg.load).toThrow('Database port number not set');
    });

    test('should throw exception when no host is configured', () => {
        jest.spyOn(config, 'getDatabaseConfig').mockReturnValueOnce({
            username: 'valid username',
            password: 'valid password',
            database: 'valid database',
            host: null,
            dialect: 'valid dialect',
            port: 100
        });

        expect(databaseCfg.load).toThrow('Database host not set');
    });

    test('should throw exception when no user is configured', () => {
        jest.spyOn(config, 'getDatabaseConfig').mockReturnValueOnce({
            username: null,
            password: 'valid password',
            database: 'valid database',
            host: 'valid host',
            dialect: 'valid dialect',
            port: 10
        });

        expect(databaseCfg.load).toThrow('Database user not set');
    });

    test('should throw exception when no password is configured', () => {
        jest.spyOn(config, 'getDatabaseConfig').mockReturnValueOnce({
            username: 'valid username',
            password: null,
            database: 'valid database',
            host: 'valid host',
            dialect: 'valid dialect',
            port: 10
        });

        expect(databaseCfg.load).toThrow('Database password not set');
    });

    test('should throw exception when no database is configured', () => {
        jest.spyOn(config, 'getDatabaseConfig').mockReturnValueOnce({
            username: 'valid username',
            password: 'valid password',
            database: null,
            host: 'valid host',
            dialect: 'valid dialect',
            port: 10
        });

        expect(databaseCfg.load).toThrow('Database name not set');
    });

    test('should throw exception when no dialect is configured', () => {
        jest.spyOn(config, 'getDatabaseConfig').mockReturnValueOnce({
            username: 'valid username',
            password: 'valid password',
            database: 'valid database',
            host: 'valid host',
            dialect: null,
            port: 10
        });

        expect(databaseCfg.load).toThrow('Database dialect not set');
    });

    test('should create right config options', () => {
        jest.spyOn(config, 'getDatabaseConfig').mockReturnValueOnce({
            username: 'valid username',
            password: 'valid password',
            database: 'valid database',
            host: 'valid host',
            dialect: 'valid dialect',
            port: 10
        });

        const dbConfig = databaseCfg.load();

        expect(dbConfig.port).toEqual(10);
        expect(dbConfig.host).toEqual('valid host');
        expect(dbConfig.username).toEqual('valid username');
        expect(dbConfig.password).toEqual('valid password');
        expect(dbConfig.database).toEqual('valid database');
        expect(dbConfig.dialect).toEqual('valid dialect');
        expect(dbConfig.timezone).toEqual('+00:00');
        expect(dbConfig.define.timestamps).toEqual(true);
        expect(dbConfig.define.charset).toEqual('utf8');
    });
});
