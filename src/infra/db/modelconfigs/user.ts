import { DataTypes, Sequelize, Model } from 'sequelize';
import { UserAttributes } from '@/domain/models/user/user';

export default class UserModel extends Model<UserAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public passwordHash!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function initializeModel(sequelize: Sequelize): void {
    UserModel.init(
        {
            id: {
                type: DataTypes.UUIDV4,
                autoIncrement: true,
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
            passwordHash: {
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
            tableName: 'user'
        }
    );
}
