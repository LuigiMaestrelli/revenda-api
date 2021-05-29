import { IController } from '@/presentation/protocols';
import { GetUserImageController } from '@/presentation/controllers/user/getUserImage';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeGetUserImageValidation } from './getUserImageValidationFactory';
import { makeUserImageUseCase } from '@/main/factories/application/user/userImageFactory';

export const makeGetUserImage = (): IController => {
    const userImageUseCase = makeUserImageUseCase();
    const validation = makeGetUserImageValidation();
    const controller = new GetUserImageController(validation, userImageUseCase);

    return makeLogControllerDecorator(controller);
};
