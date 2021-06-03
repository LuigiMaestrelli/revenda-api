import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeInactivateBrandValidation } from './inactivateBrandValidationFactory';
import { InactivateBrandController } from '@/presentation/controllers/brand/inactivateBrand';
import { makeBrandUseCase } from '@/main/factories/application/brand/brandFactory';

export const makeInactivateBrand = (): IController => {
    const validations = makeInactivateBrandValidation();
    const brandUseCase = makeBrandUseCase();

    const controller = new InactivateBrandController(validations, brandUseCase);
    return makeLogControllerDecorator(controller);
};
