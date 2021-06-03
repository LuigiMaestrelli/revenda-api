import { makeBrandRepository } from '@/main/factories/repository/brand/brandRepositoryFactory';
import { BrandUseCase } from '@/application/usecases/brand/brand';

export const makeBrandUseCase = (): BrandUseCase => {
    const brandRepository = makeBrandRepository();
    return new BrandUseCase(brandRepository);
};
