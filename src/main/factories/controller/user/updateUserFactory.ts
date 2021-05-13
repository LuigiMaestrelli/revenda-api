import { IController } from '@/presentation/protocols';
import { UpdateUserController } from '@/presentation/controllers/user/updateUser';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeUserRepository } from '@/main/factories/repository/user/userRepositoryFactory';
import { makeUpdateUserValidation } from './updateUserValidationFactory';
import { ObjectManipulation } from '@/infra/adapters/objects/objectManipulationAdapter';

export const makeUpdateUser = (): IController => {
    const validations = makeUpdateUserValidation();
    const userRepository = makeUserRepository();
    const objectManipulation = new ObjectManipulation();

    const controller = new UpdateUserController(validations, objectManipulation, userRepository);
    return makeLogControllerDecorator(controller);
};
