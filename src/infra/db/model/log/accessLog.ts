import { Sequelize, DataTypes } from 'sequelize';
import { AccessLogAttributes, CreateAccessLogAttributes } from '@/domain/models/log/accessLog';
import BaseModel from '../infra/basemodel';

export default class AccessLogModel
    extends BaseModel<AccessLogAttributes, CreateAccessLogAttributes>
    implements AccessLogAttributes
{
    public id!: string;
    public authorized!: boolean;
    public email!: string;
    public ip?: string;
    public userAgent?: string;
    public hostName?: string;
    public origin?: string;
    public reason?: string;

    static initialize(sequelize: Sequelize): void {
        AccessLogModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true
                },
                authorized: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                email: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                ip: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                userAgent: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                hostName: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                origin: {
                    type: DataTypes.TEXT,
                    allowNull: true
                },
                reason: {
                    type: DataTypes.TEXT,
                    allowNull: true
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
                tableName: 'accesslog'
            }
        );
    }
}
