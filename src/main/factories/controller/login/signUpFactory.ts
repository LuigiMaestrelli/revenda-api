import { Controller } from '@/presentation/interfaces';
import { SignUpController } from '@/presentation/controllers/login/signUp';
import { makeUserApplication } from '@/main/factories/application/user/userApplicationFactory';
import { makeSignUpValidation } from './signupValidationFactory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/logControllerFactory';

export const makeSignUpController = (): Controller => {
    const signUpValidation = makeSignUpValidation();
    const userApplication = makeUserApplication();

    const controller = new SignUpController(signUpValidation, userApplication);
    return makeLogControllerDecorator(controller);
};
