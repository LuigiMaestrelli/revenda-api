import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeDeleteBrandValidation } from './deleteBrandValidationFactory';
import { DeleteBrandController } from '@/presentation/controllers/brand/deleteBrand';
import { makeBrandUseCase } from '@/main/factories/application/brand/brandFactory';

export const makeDeleteBrand = (): IController => {
    const validations = makeDeleteBrandValidation();
    const brandUseCase = makeBrandUseCase();

    const controller = new DeleteBrandController(validations, brandUseCase);
    return makeLogControllerDecorator(controller);
};
