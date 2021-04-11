import { Options } from 'sequelize';
import config from '../config';

export default {
    load: function (): Options {
        config.load();

        if (!process.env.DB_PORT) {
            throw new Error('Database port number not set');
        }

        if (!process.env.DB_HOST) {
            throw new Error('Database host not set');
        }

        if (!process.env.DB_USER) {
            throw new Error('Database user not set');
        }

        if (!process.env.DB_PASS) {
            throw new Error('Database password not set');
        }

        const portNumber = parseInt(process.env.DB_PORT, 10);

        return {
            port: portNumber,
            host: process.env.DB_HOST,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            dialect: 'postgres',
            logging: false,
            logQueryParameters: true,
            benchmark: true,
            native: false,
            timezone: '+00:00',
            define: {
                timestamps: true,
                paranoid: false,
                underscored: false,
                freezeTableName: true,
                charset: 'utf8',
                createdAt: 'createdAt',
                updatedAt: 'updatedAt'
            },
            pool: {
                max: 30,
                min: 3,
                idle: 120000
            },
            retry: {
                max: 5
            }
        };
    }
};
