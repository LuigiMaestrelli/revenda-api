import { IController } from '@/presentation/protocols';
import { GetUserImageController } from '@/presentation/controllers/user/getUserImage';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUpdateUserImageValidation } from './updateUserImageValidationFactory';
import { makeUserImageUseCase } from '@/main/factories/application/user/userImageFactory';

export const makeGetUserImage = (): IController => {
    const userImageUseCase = makeUserImageUseCase();
    const validation = makeUpdateUserImageValidation();
    const controller = new GetUserImageController(validation, userImageUseCase);

    return makeLogControllerDecorator(controller);
};
