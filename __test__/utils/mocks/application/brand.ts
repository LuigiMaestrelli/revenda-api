import { CreateBrandAttributes, BrandAttributes, UpdateBrandAttributes } from '@/domain/models/brand/brand';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';

export function makeBrandUseCaseStub(): IBrandUseCase {
    class BrandUseCaseStub implements IBrandUseCase {
        async add(values: CreateBrandAttributes): Promise<BrandAttributes> {
            return {
                id: 'valid id',
                active: true,
                ...values
            };
        }

        async update(id: string, values: UpdateBrandAttributes): Promise<BrandAttributes> {
            return {
                id,
                description: 'valid description',
                active: true,
                ...values
            };
        }

        async delete(id: string): Promise<void> {}

        async active(id: string): Promise<void> {}

        async inactive(id: string): Promise<void> {}
    }

    return new BrandUseCaseStub();
}
