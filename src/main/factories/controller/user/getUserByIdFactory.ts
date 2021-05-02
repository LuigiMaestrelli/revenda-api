import { IController } from '@/presentation/protocols';
import { GetUserByIdController } from '@/presentation/controllers/user/getUserById';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';

export const makeGetUserById = (): IController => {
    const userRepository = makeUserRepository();

    const controller = new GetUserByIdController(userRepository);
    return makeLogControllerDecorator(controller);
};
