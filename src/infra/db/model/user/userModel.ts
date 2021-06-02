import { Sequelize, DataTypes } from 'sequelize';
import { CreateUserAttributes, UserAttributes } from '@/domain/models/user/user';
import BaseModel from '../infra/basemodel';

export default class UserModel extends BaseModel<UserAttributes, CreateUserAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public active!: boolean;

    static initialize(sequelize: Sequelize): void {
        UserModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true
                },
                name: {
                    type: new DataTypes.STRING(200),
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: 'User`s name cannot be null'
                        },
                        len: {
                            args: [1, 200],
                            msg: 'User`s name cannot be bigger than 200 characters'
                        }
                    }
                },
                email: {
                    type: new DataTypes.STRING(200),
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: 'User`s e-mail cannot be null'
                        },
                        len: {
                            args: [1, 200],
                            msg: 'User`s e-mail cannot be bigger than 200 characters'
                        }
                    }
                },
                password: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: 'User`s password cannot be null'
                        }
                    }
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
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

    static associate(models: any): void {
        this.hasOne(models.UserImageModel, {
            foreignKey: 'id',
            sourceKey: 'id',
            as: 'userImage'
        });
    }
}
