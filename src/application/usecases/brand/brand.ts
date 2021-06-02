import { BrandAttributes, CreateBrandAttributes, UpdateBrandAttributes } from '@/domain/models/brand/brand';
import { IBrandRepository } from '@/domain/repository/brand/brand';
import { IBrandUseCase } from '@/domain/usecases/brand/brand';

export class BrandUseCase implements IBrandUseCase {
    constructor(private readonly brandRepository: IBrandRepository) {}

    async add(values: CreateBrandAttributes): Promise<BrandAttributes> {
        return await this.brandRepository.add(values);
    }

    async update(id: string, values: UpdateBrandAttributes): Promise<BrandAttributes> {
        return await this.brandRepository.update(id, values);
    }

    async active(id: string): Promise<void> {
        await this.brandRepository.update(id, { active: true });
    }

    async inactive(id: string): Promise<void> {
        await this.brandRepository.update(id, { active: false });
    }

    async findById(id: string): Promise<BrandAttributes> {
        return await this.brandRepository.findById(id);
    }

    async delete(id: string): Promise<void> {
        await this.brandRepository.delete(id);
    }
}
