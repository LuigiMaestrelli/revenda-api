import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { BrandRepository } from '@/infra/db/repository/brand/brand';

export const makeBrandRepository = (): BrandRepository => {
    const idGenerator = new UUIDAdapter();
    return new BrandRepository(idGenerator);
};
