import config from '@/main/config';

const DEFAULT_DATABASE_CFG = {
    development: {
        database: 'development'
    },
    test: {
        database: 'test'
    },
    production: {
        database: 'production'
    }
};

const DEFAULT_SYSTEM_CFG = {
    development: {
        appSecret: 'app secret development',
        appSecretRefresh: 'secret refresh development',
        appSecretExpires: 5
    },
    test: {
        appSecret: 'app secret test',
        appSecretRefresh: 'secret refresh test',
        appSecretExpires: 4
    },
    production: {
        appSecret: 'app secret production',
        appSecretRefresh: 'secret refresh production',
        appSecretExpires: 3
    }
};

describe('Main config functions', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
    });

    afterAll(() => {
        process.env = { ...OLD_ENV };
    });

    describe('System environment', () => {
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

        test('should validate when running on production as default', () => {
            process.env.NODE_ENV = null;

            expect(config.isTest()).toBe(false);
            expect(config.isDev()).toBe(false);
            expect(config.isProduction()).toBe(true);
        });
    });

    describe('Load database config', () => {
        test('should load configuration if none is loaded', () => {
            config.databaseConfig = null;
            const loadSpy = jest.spyOn(config, 'load');

            config.getDatabaseConfig();

            expect(loadSpy).toHaveBeenCalled();
        });

        test('should load development configuration when running on development', () => {
            process.env.NODE_ENV = 'dev';

            config.databaseConfig = DEFAULT_DATABASE_CFG;
            const database = config.getDatabaseConfig();

            expect(database).toEqual({
                database: 'development'
            });
        });

        test('should load test configuration when running on test', () => {
            process.env.NODE_ENV = 'test';

            config.databaseConfig = DEFAULT_DATABASE_CFG;
            const database = config.getDatabaseConfig();

            expect(database).toEqual({
                database: 'test'
            });
        });

        test('should load production configuration when running on production', () => {
            process.env.NODE_ENV = 'production';

            config.databaseConfig = DEFAULT_DATABASE_CFG;
            const database = config.getDatabaseConfig();

            expect(database).toEqual({
                database: 'production'
            });
        });
    });

    describe('Load system config', () => {
        test('should load configuration if none is loaded', () => {
            config.systemConfig = null;
            const loadSpy = jest.spyOn(config, 'load');

            config.getSystemConfig();

            expect(loadSpy).toHaveBeenCalled();
        });

        test('should load development configuration when running on development', () => {
            process.env.NODE_ENV = 'dev';

            config.systemConfig = DEFAULT_SYSTEM_CFG;
            const systemConfig = config.getSystemConfig();

            expect(systemConfig).toEqual({
                appSecret: 'app secret development',
                appSecretRefresh: 'secret refresh development',
                appSecretExpires: 5
            });
        });

        test('should load test configuration when running on test', () => {
            process.env.NODE_ENV = 'test';

            config.systemConfig = DEFAULT_SYSTEM_CFG;
            const systemConfig = config.getSystemConfig();

            expect(systemConfig).toEqual({
                appSecret: 'app secret test',
                appSecretRefresh: 'secret refresh test',
                appSecretExpires: 4
            });
        });

        test('should load production configuration when running on production', () => {
            process.env.NODE_ENV = 'production';

            config.systemConfig = DEFAULT_SYSTEM_CFG;
            const systemConfig = config.getSystemConfig();

            expect(systemConfig).toEqual({
                appSecret: 'app secret production',
                appSecretRefresh: 'secret refresh production',
                appSecretExpires: 3
            });
        });
    });

    describe('Secret token', () => {
        test('should load correct app secret when running on development', () => {
            process.env.NODE_ENV = 'dev';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretTokenKey()).toBe('app secret development');
        });

        test('should load correct app secret when running on test', () => {
            process.env.NODE_ENV = 'test';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretTokenKey()).toBe('app secret test');
        });

        test('should load correct app secret when running on production', () => {
            process.env.NODE_ENV = 'production';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretTokenKey()).toBe('app secret production');
        });
    });

    describe('Secret refreshtoken', () => {
        test('should load correct app secret refresh when running on development', () => {
            process.env.NODE_ENV = 'dev';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretRefreshTokenKey()).toBe('secret refresh development');
        });

        test('should load correct app secret refresh when running on test', () => {
            process.env.NODE_ENV = 'test';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretRefreshTokenKey()).toBe('secret refresh test');
        });

        test('should load correct app secret refresh when running on production', () => {
            process.env.NODE_ENV = 'production';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretRefreshTokenKey()).toBe('secret refresh production');
        });
    });

    describe('Secret expires', () => {
        test('should load correct app secret expires when running on development', () => {
            process.env.NODE_ENV = 'dev';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretExpires()).toBe(5);
        });

        test('should load correct app secret expires when running on test', () => {
            process.env.NODE_ENV = 'test';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretExpires()).toBe(4);
        });

        test('should load correct app secret expires when running on production', () => {
            process.env.NODE_ENV = 'production';

            config.systemConfig = DEFAULT_SYSTEM_CFG;

            expect(config.getTokenSecretExpires()).toBe(3);
        });
    });
});
