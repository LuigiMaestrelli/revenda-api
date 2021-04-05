import { PasswordValidator } from '@/presentation/interfaces/validators';
import validator from 'validator';

export const PASSWORD_CONFIG = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: false
};

export class PasswordValidatorAdapter implements PasswordValidator {
    isStrongPassword(password: string): boolean {
        return validator.isStrongPassword(password, PASSWORD_CONFIG);
    }
}
