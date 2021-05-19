import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeActivateUserValidation } from './activateUserValidationFactory';
import { ActivateUserController } from '@/presentation/controllers/user/activateUser';
import { makeUserUseCase } from '@/main/factories/application/user/userFactory';

export const makeActivateUser = (): IController => {
    const validations = makeActivateUserValidation();
    const userUseCase = makeUserUseCase();

    const controller = new ActivateUserController(validations, userUseCase);
    return makeLogControllerDecorator(controller);
};
