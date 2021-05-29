import { IController } from '@/presentation/protocols';
import { GetUserMiniatureController } from '@/presentation/controllers/user/getUserMiniature';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeGetUserMiniatureValidation } from './getUserMiniatureValidationFactory';
import { makeUserImageUseCase } from '@/main/factories/application/user/userImageFactory';

export const makeGetUserMiniature = (): IController => {
    const userImageUseCase = makeUserImageUseCase();
    const validation = makeGetUserMiniatureValidation();
    const controller = new GetUserMiniatureController(validation, userImageUseCase);

    return makeLogControllerDecorator(controller);
};
