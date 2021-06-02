import { IBrandRepository } from '@/domain/repository/brand/brand';
import { CreateBrandAttributes, BrandAttributes, UpdateBrandAttributes } from 'domain/models/brand/brand';

export function makeBrandRepositoryStub(): IBrandRepository {
    class BrandRepositoryStub implements IBrandRepository {
        async add(values: CreateBrandAttributes): Promise<BrandAttributes> {
            const currentData = {
                id: 'valid id',
                active: true
            };

            return {
                ...currentData,
                ...values
            };
        }

        async findById(id: string): Promise<BrandAttributes> {
            return {
                id: 'valid id',
                description: 'valid description',
                active: true
            };
        }

        async update(id: string, values: UpdateBrandAttributes): Promise<BrandAttributes> {
            const currentData = {
                id,
                description: 'valid description',
                active: true
            };

            return {
                ...currentData,
                ...values
            };
        }

        async delete(id: string): Promise<void> {}
    }

    return new BrandRepositoryStub();
}
