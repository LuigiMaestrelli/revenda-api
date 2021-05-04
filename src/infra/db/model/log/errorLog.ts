import { Sequelize, DataTypes } from 'sequelize';
import { ErrorLogAttributes } from '@/domain/models/log/errorLog';
import BaseModel from '../infra/basemodel';

export default class ErrorLogModel extends BaseModel<ErrorLogAttributes> implements ErrorLogAttributes {
    public id!: string;
    public location!: string;
    public message!: string;
    public stack!: string;

    static initialize(sequelize: Sequelize): void {
        ErrorLogModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true
                },
                location: {
                    type: new DataTypes.STRING(200),
                    allowNull: false
                },
                message: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                stack: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: 'errorlog'
            }
        );
    }
}
