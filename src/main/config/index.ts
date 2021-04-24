import dotenv from 'dotenv';

export default {
    load(): string {
        const envFile = this.isTest() ? '.env.test' : '.env';

        dotenv.config({
            path: envFile
        });

        return envFile;
    },

    isTest(): boolean {
        return process.env.NODE_ENV === 'test';
    },

    isDev(): boolean {
        return process.env.NODE_ENV === 'dev';
    },

    isProduction(): boolean {
        return process.env.NODE_ENV === 'production';
    },

    getTokenSecretTokenKey(): string {
        return process.env.APP_SECRET ?? '';
    },

    getTokenSecretRefreshTokenKey(): string {
        return process.env.APP_SECRET_REFRESH ?? '';
    },

    getTokenSecretExpires(): number {
        return parseInt(process.env.APP_SECRET_EXPIRES ?? '1');
    }
};
