import { Model } from 'sequelize';

export default class BaseModel<T> extends Model<T> {
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
