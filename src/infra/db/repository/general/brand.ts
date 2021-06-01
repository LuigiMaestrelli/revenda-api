import { IBrandRepository } from '@/domain/repository/general/brand';
import { BrandAttributes, CreateBrandAttributes, UpdateBrandAttributes } from 'domain/models/general/brand';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import BrandModel from '@/infra/db/model/general/brandModel';
import { NotFoundError } from '@/shared/errors/notFoundError';

export class BrandRepository implements IBrandRepository {
    constructor(private readonly idGenerator: IIdGenerator) {}

    async add(values: CreateBrandAttributes): Promise<BrandAttributes> {
        const id = await this.idGenerator.generate();

        return await BrandModel.create({
            id,
            ...values
        });
    }

    async update(id: string, values: UpdateBrandAttributes): Promise<BrandAttributes> {
        const item = await BrandModel.findByPk(id);
        if (!item) {
            throw new NotFoundError('Data not found');
        }

        return await item.update(values);
    }

    async findById(id: string): Promise<BrandAttributes> {
        return await BrandModel.findByPk(id);
    }

    async delete(id: string): Promise<void> {
        const item = await BrandModel.findByPk(id);
        if (!item) {
            throw new NotFoundError('Data not found');
        }

        await item.destroy();
    }
}
