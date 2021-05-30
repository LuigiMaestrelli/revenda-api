import { IController } from '@/presentation/protocols';
import { SignInRefreshTokenController } from '@/presentation/controllers/login/signInRefreshToken';
import { makeSignInRefreshTokenValidation } from './signInRefreshTokenValidationFactory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';
import { makeAuthenticationUseCase } from '@/main/factories/application/auth/authFactory';

export const makeSignInRefreshTokenController = (): IController => {
    const signInValidation = makeSignInRefreshTokenValidation();
    const authUseCase = makeAuthenticationUseCase();

    const controller = new SignInRefreshTokenController(signInValidation, authUseCase);
    return makeLogControllerDecorator(controller);
};
