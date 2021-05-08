import { IController } from '@/presentation/protocols';
import { UpdateUserController } from '@/presentation/controllers/user/updateUser';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';
import { makeUpdateUserValidation } from './updateUserValidationFactory';

export const makeUpdateUser = (): IController => {
    const validations = makeUpdateUserValidation();
    const userRepository = makeUserRepository();

    const controller = new UpdateUserController(validations, userRepository);
    return makeLogControllerDecorator(controller);
};
