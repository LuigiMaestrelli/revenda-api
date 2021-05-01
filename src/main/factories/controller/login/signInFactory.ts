import { IController } from '@/presentation/protocols';
import { SignInController } from '@/presentation/controllers/login/signIn';
import { makeSignInValidation } from './signInValidationFactory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeAuthApplication } from '@/main/factories/application/auth/authApplicationFactory';

export const makeSignInController = (): IController => {
    const signInValidation = makeSignInValidation();
    const authApplication = makeAuthApplication();

    const controller = new SignInController(signInValidation, authApplication);
    return makeLogControllerDecorator(controller);
};
