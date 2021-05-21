import { IController } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makechangeUserPasswordValidation } from './changeUserPasswordValidationFactory';
import { makeUserUseCase } from '@/main/factories/application/user/userFactory';
import { ChangeUserPasswordController } from '@/presentation/controllers/user/changeUserPassword';

export const makeChangeUserPassword = (): IController => {
    const validations = makechangeUserPasswordValidation();
    const userUseCase = makeUserUseCase();

    const controller = new ChangeUserPasswordController(validations, userUseCase);
    return makeLogControllerDecorator(controller);
};
