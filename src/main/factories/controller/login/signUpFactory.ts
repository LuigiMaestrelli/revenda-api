import { SignUpController } from '@/presentation/controllers/login/signUp';
import { makeUserApplication } from '@/main/factories/application/user/userApplicationFactory';
import { makeSignUpValidation } from './signupValidationFactory';

export const makeSignUpController = (): SignUpController => {
    const signUpValidation = makeSignUpValidation();
    const userApplication = makeUserApplication();

    return new SignUpController(signUpValidation, userApplication);
};
