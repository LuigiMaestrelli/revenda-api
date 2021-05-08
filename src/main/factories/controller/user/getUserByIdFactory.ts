import { IController } from '@/presentation/protocols';
import { GetUserByIdController } from '@/presentation/controllers/user/getUserById';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';
import { makeGetUserByIdValidation } from './getUserByIdValidationFactory';

export const makeGetUserById = (): IController => {
    const validations = makeGetUserByIdValidation();
    const userRepository = makeUserRepository();

    const controller = new GetUserByIdController(validations, userRepository);
    return makeLogControllerDecorator(controller);
};
