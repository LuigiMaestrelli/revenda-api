import { SignUpController } from '@/presentation/controllers/signup/signUp';
import { makeUserApplication } from '@/main/factories/application/user/userApplicationFactory';
import { EmailValidatorAdapter } from '@/infra/adapters/validators/emailValidatorAdapter';
import { PasswordValidatorAdapter } from '@/infra/adapters/validators/passwordValidatorAdapter';

export const makeSignUpController = (): SignUpController => {
    const emailValidador = new EmailValidatorAdapter();
    const passwordValidator = new PasswordValidatorAdapter();
    const userApplication = makeUserApplication();

    return new SignUpController(emailValidador, passwordValidator, userApplication);
};
