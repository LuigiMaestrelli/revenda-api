import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeActivateBrandValidation } from './activateBrandValidationFactory';
import { ActivateBrandController } from '@/presentation/controllers/brand/activateBrand';
import { makeBrandUseCase } from '@/main/factories/application/brand/brandFactory';

export const makeActivateBrand = (): IController => {
    const validations = makeActivateBrandValidation();
    const brandUseCase = makeBrandUseCase();

    const controller = new ActivateBrandController(validations, brandUseCase);
    return makeLogControllerDecorator(controller);
};
