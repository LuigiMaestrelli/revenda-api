import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeActivateUserValidation } from './activateUserValidationFactory';
import { InactivateUserController } from '@/presentation/controllers/user/inactivateUser';
import { makeUserUseCase } from '@/main/factories/application/user/userFactory';

export const makeInactivateUser = (): IController => {
    const validations = makeActivateUserValidation();
    const userUseCase = makeUserUseCase();

    const controller = new InactivateUserController(validations, userUseCase);
    return makeLogControllerDecorator(controller);
};
