import { BrandAttributes, CreateBrandAttributes, UpdateBrandAttributes } from '@/domain/models/brand/brand';

export interface IBrandUseCase {
    add: (values: CreateBrandAttributes) => Promise<BrandAttributes>;
    update: (id: string, values: UpdateBrandAttributes) => Promise<BrandAttributes>;
    delete: (id: string) => Promise<void>;
    active: (id: string) => Promise<void>;
    inactive: (id: string) => Promise<void>;
}
