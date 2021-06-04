import { Options } from 'sequelize';
import config from '../config';

export default {
    load: function (): Options {
        const configDatabase = config.getDatabaseConfig();

        if (!configDatabase.port) {
            throw new Error('Database port number not set');
        }

        if (!configDatabase.host) {
            throw new Error('Database host not set');
        }

        if (!configDatabase.username) {
            throw new Error('Database user not set');
        }

        if (!configDatabase.password) {
            throw new Error('Database password not set');
        }

        if (!configDatabase.database) {
            throw new Error('Database name not set');
        }

        if (!configDatabase.dialect) {
            throw new Error('Database dialect not set');
        }

        return {
            port: configDatabase.port,
            host: configDatabase.host,
            username: configDatabase.username,
            password: configDatabase.password,
            database: configDatabase.database,
            dialect: configDatabase.dialect,
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
                updatedAt: 'updatedAt',
                deletedAt: 'deletedAt'
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
