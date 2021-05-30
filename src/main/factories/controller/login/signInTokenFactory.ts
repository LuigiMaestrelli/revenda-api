import { IController } from '@/presentation/protocols';
import { SignInTokenController } from '@/presentation/controllers/login/signInToken';
import { makeSignInTokenValidation } from './signInTokenValidationFactory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeAuthenticationUseCase } from '@/main/factories/application/auth/authFactory';

export const makeSignInTokenController = (): IController => {
    const signInValidation = makeSignInTokenValidation();
    const authUseCase = makeAuthenticationUseCase();

    const controller = new SignInTokenController(signInValidation, authUseCase);
    return makeLogControllerDecorator(controller);
};
