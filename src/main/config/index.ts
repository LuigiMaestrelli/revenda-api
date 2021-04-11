import dotenv from 'dotenv';

export default {
    load() {
        dotenv.config({
            path: this.isTest() ? '.env.test' : '.env'
        });
    },

    isTest() {
        return process.env.NODE_ENV === 'test';
    },

    isDev() {
        return process.env.NODE_ENV === 'dev';
    },

    isProduction() {
        return process.env.NODE_ENV === 'production';
    }
};
