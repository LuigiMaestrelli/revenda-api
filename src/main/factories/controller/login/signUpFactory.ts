import { IController } from '@/presentation/protocols';
import { SignUpController } from '@/presentation/controllers/login/signUp';
import { makeUserUseCase } from '@/main/factories/application/user/userFactory';
import { makeSignUpValidation } from './signUpValidationFactory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';

export const makeSignUpController = (): IController => {
    const signUpValidation = makeSignUpValidation();
    const userUseCase = makeUserUseCase();

    const controller = new SignUpController(signUpValidation, userUseCase);
    return makeLogControllerDecorator(controller);
};
