import { Sequelize, DataTypes } from 'sequelize';
import { UserImageAttributes, CreateUserImageAttributes } from 'domain/models/user/userImage';
import BaseModel from '../infra/basemodel';

export default class UserImageModel
    extends BaseModel<UserImageAttributes, CreateUserImageAttributes>
    implements UserImageAttributes
{
    id!: string;
    image!: Buffer;
    miniature!: Buffer;
    name!: string;
    mimetype!: string;
    imageSize!: number;
    miniatureSize!: number;

    static initialize(sequelize: Sequelize): void {
        UserImageModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true
                },
                image: {
                    type: DataTypes.BLOB,
                    allowNull: false
                },
                miniature: {
                    type: DataTypes.BLOB,
                    allowNull: false
                },
                name: {
                    type: new DataTypes.STRING(500),
                    allowNull: false
                },
                mimetype: {
                    type: new DataTypes.STRING(200),
                    allowNull: false
                },
                imageSize: {
                    type: DataTypes.DOUBLE,
                    allowNull: false
                },
                miniatureSize: {
                    type: DataTypes.DOUBLE,
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
                tableName: 'userImages'
            }
        );
    }
}
