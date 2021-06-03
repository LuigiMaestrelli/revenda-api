import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUpdateBrandValidation } from './updateBrandValidationFactory';
import { UpdateBrandController } from '@/presentation/controllers/brand/updateBrand';
import { makeBrandUseCase } from '@/main/factories/application/brand/brandFactory';
import { ObjectManipulation } from '@/infra/adapters/objects/objectManipulationAdapter';

export const makeUpdateBrand = (): IController => {
    const validations = makeUpdateBrandValidation();
    const brandUseCase = makeBrandUseCase();
    const objectManipulation = new ObjectManipulation();

    const controller = new UpdateBrandController(validations, objectManipulation, brandUseCase);
    return makeLogControllerDecorator(controller);
};
