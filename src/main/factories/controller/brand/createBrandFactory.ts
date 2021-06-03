import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeCreateBrandValidation } from './createBrandValidationFactory';
import { CreateBrandController } from '@/presentation/controllers/brand/createBrand';
import { makeBrandUseCase } from '@/main/factories/application/brand/brandFactory';

export const makeCreateBrand = (): IController => {
    const validations = makeCreateBrandValidation();
    const brandUseCase = makeBrandUseCase();

    const controller = new CreateBrandController(validations, brandUseCase);
    return makeLogControllerDecorator(controller);
};
