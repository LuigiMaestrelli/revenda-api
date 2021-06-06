import { Sequelize } from 'sequelize';
import path from 'path';

import dbConfig from '@/main/config/database';
import { getFileList } from '@/shared/utils/files';

/* @ts-expect-error */
Sequelize.postgres.DECIMAL.parse = (value: any): number => parseFloat(value);
/* @ts-expect-error */
Sequelize.postgres.BIGINT.parse = (value: any): number => parseInt(value, 10);

const config = dbConfig.load();
const connection = new Sequelize(config);

const modelPath = path.join(__dirname, './model');
const ignoreFiles = ['index.ts', 'index.js', 'basemodel.ts', 'basemodel.js'];
const modelClasses = getFileList(modelPath, ignoreFiles).map(filePath => require(filePath));

modelClasses.forEach(Model => Model.default.initialize(connection));
modelClasses.filter(p => !!p.default.associate).forEach(Model => Model.default.associate(connection.models));

export default connection;
