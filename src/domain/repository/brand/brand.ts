import { BrandAttributes, CreateBrandAttributes, UpdateBrandAttributes } from '@/domain/models/brand/brand';

export interface IBrandRepository {
    add: (values: CreateBrandAttributes) => Promise<BrandAttributes>;
    findById: (id: string) => Promise<BrandAttributes>;
    update: (id: string, values: UpdateBrandAttributes) => Promise<BrandAttributes>;
    delete: (id: string) => Promise<void>;
}
