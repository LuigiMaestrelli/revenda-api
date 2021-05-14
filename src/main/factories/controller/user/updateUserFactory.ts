import { IController } from '@/presentation/protocols';
import { UpdateUserController } from '@/presentation/controllers/user/updateUser';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUpdateUserValidation } from './updateUserValidationFactory';
import { ObjectManipulation } from '@/infra/adapters/objects/objectManipulationAdapter';
import { makeUserUseCase } from '../../application/user/userFactory';

export const makeUpdateUser = (): IController => {
    const validations = makeUpdateUserValidation();
    const userUseCase = makeUserUseCase();
    const objectManipulation = new ObjectManipulation();

    const controller = new UpdateUserController(validations, objectManipulation, userUseCase);
    return makeLogControllerDecorator(controller);
};
