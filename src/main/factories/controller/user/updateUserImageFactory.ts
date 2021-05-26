import { IController } from '@/presentation/protocols';
import { UpdateUserImageController } from '@/presentation/controllers/user/updateImage';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUpdateUserImageValidation } from './updateUserImageValidationFactory';
import { makeUserImageUseCase } from '@/main/factories/application/user/userImageFactory';

export const makeUpdateUserImage = (): IController => {
    const userImageUseCase = makeUserImageUseCase();
    const validation = makeUpdateUserImageValidation();
    const controller = new UpdateUserImageController(validation, userImageUseCase);

    return makeLogControllerDecorator(controller);
};
