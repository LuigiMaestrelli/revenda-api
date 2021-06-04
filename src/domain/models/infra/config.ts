export type DatabaseConfig = {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: any;
    port: number;
};

export type DatabaseConfigFile = {
    development: DatabaseConfig;
    test: DatabaseConfig;
    production: DatabaseConfig;
};

export type SystemConfigFile = {
    development: SystemConfig;
    test: SystemConfig;
    production: SystemConfig;
};

export type SystemConfig = {
    serverPort: number;
    appSecret: string;
    appSecretRefresh: string;
    appSecretExpires: number;
};
