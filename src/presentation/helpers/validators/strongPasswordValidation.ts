import { InvalidParamError } from '@/shared/errors';
import { Validation, PasswordValidator } from '@/presentation/interfaces';

export class StrongPasswordValidation implements Validation {
    constructor(private readonly fieldName: string, private readonly passwordValidator: PasswordValidator) {}

    validate(input: any): Error | null {
        if (!this.passwordValidator.isStrongPassword(input[this.fieldName])) {
            return new InvalidParamError('password is too week');
        }

        return null;
    }
}
