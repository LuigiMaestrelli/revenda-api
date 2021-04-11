import { Model, Sequelize, DataTypes } from 'sequelize';
import { UserAttributes } from '@/domain/models/user/user';

export default class UserModel extends Model<UserAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

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
