import { Model } from 'sequelize';

export default class BaseModel<T, E> extends Model<T, E> {
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}
