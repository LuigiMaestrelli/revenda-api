import { Sequelize, DataTypes } from 'sequelize';
import { BrandAttributes, CreateBrandAttributes } from 'domain/models/general/brand';
import BaseModel from '../infra/basemodel';

export default class BrandModel extends BaseModel<BrandAttributes, CreateBrandAttributes> implements BrandAttributes {
    public id!: string;
    public description!: string;
    public active!: boolean;

    static initialize(sequelize: Sequelize): void {
        BrandModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    primaryKey: true
                },
                description: {
                    type: new DataTypes.STRING(200),
                    allowNull: false,
                    validate: {
                        notNull: {
                            msg: 'Brand`s description cannot be null'
                        },
                        len: {
                            args: [1, 200],
                            msg: 'Brand`s description cannot be bigger than 200 characters'
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
                tableName: 'brands'
            }
        );
    }
}
