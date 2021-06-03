import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeGetBrandByIdValidation } from './getBrandByIdValidationFactory';
import { GetBrandByIdController } from '@/presentation/controllers/brand/getBrandById';
import { makeBrandRepository } from '@/main/factories/repository/brand/brandRepositoryFactory';

export const makeGetBrandById = (): IController => {
    const validations = makeGetBrandByIdValidation();
    const brandRepository = makeBrandRepository();

    const controller = new GetBrandByIdController(validations, brandRepository);
    return makeLogControllerDecorator(controller);
};
