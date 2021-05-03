import { IController } from '@/presentation/protocols';
import { SignInController } from '@/presentation/controllers/login/signIn';
import { makeSignInValidation } from './signInValidationFactory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeAuthenticationUseCase } from '@/main/factories/application/auth/authFactory';

export const makeSignInController = (): IController => {
    const signInValidation = makeSignInValidation();
    const authUseCase = makeAuthenticationUseCase();

    const controller = new SignInController(signInValidation, authUseCase);
    return makeLogControllerDecorator(controller);
};
