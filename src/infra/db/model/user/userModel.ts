import { Sequelize, DataTypes } from 'sequelize';
import { UserAttributes } from '@/domain/models/user/user';
import BaseModel from '../infra/basemodel';

export default class UserModel extends BaseModel<UserAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;

    static initialize(sequelize: Sequelize): void {
        UserModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true
                },
                name: {
                    type: new DataTypes.STRING(200),
                    allowNull: false
                },
                email: {
                    type: new DataTypes.STRING(200),
                    allowNull: false
                },
                password: {
                    type: new DataTypes.STRING(128),
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
                tableName: 'users'
            }
        );
    }
}
