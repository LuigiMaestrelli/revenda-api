import { Options } from 'sequelize';
import config from '../config';

config.load();

const configs: Options = {
    port: parseInt(process.env.DB_PORT ?? '', 10),
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    storage: process.env.STORAGE,
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

export default configs;
