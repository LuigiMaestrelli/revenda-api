import fs from 'fs';
import path from 'path';

import { DatabaseConfig, SystemConfig } from '@/domain/models/infra/config';

export default {
    databaseConfig: null,
    systemConfig: null,

    load(): void {
        const databaseFilePath = path.join(__dirname, '..', '..', '..', 'config', 'databaseConfig.json');
        const databaseFileData = fs.readFileSync(databaseFilePath, 'utf8');
        this.databaseConfig = JSON.parse(databaseFileData);

        const systemFilePath = path.join(__dirname, '..', '..', '..', 'config', 'systemConfig.json');
        const systemFileData = fs.readFileSync(systemFilePath, 'utf8');
        this.systemConfig = JSON.parse(systemFileData);
    },

    isTest(): boolean {
        return process.env.NODE_ENV === 'test';
    },

    isDev(): boolean {
        return process.env.NODE_ENV === 'dev';
    },

    isProduction(): boolean {
        return process.env.NODE_ENV === 'production' || !process.env.NODE_ENV;
    },

    getDatabaseConfig(): DatabaseConfig {
        if (!this.databaseConfig) {
            this.load();
        }

        if (this.isDev()) {
            return this.databaseConfig.development;
        }

        if (this.isTest()) {
            return this.databaseConfig.test;
        }

        return this.databaseConfig.production;
    },

    getSystemConfig(): SystemConfig {
        if (!this.systemConfig) {
            this.load();
        }

        if (this.isDev()) {
            return this.systemConfig.development;
        }

        if (this.isTest()) {
            return this.systemConfig.test;
        }

        return this.systemConfig.production;
    },

    getTokenSecretTokenKey(): string {
        const config = this.getSystemConfig();
        return config.appSecret;
    },

    getTokenSecretRefreshTokenKey(): string {
        const config = this.getSystemConfig();
        return config.appSecretRefresh;
    },

    getTokenSecretExpires(): number {
        const config = this.getSystemConfig();
        return config.appSecretExpires;
    }
};
