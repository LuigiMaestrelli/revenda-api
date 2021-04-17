import { InvalidParamError } from '@/shared/errors';
import { Validation, PasswordValidator } from '@/presentation/interfaces';

export class StrongPasswordValidation implements Validation {
    constructor(private readonly fieldName: string, private readonly passwordValidator: PasswordValidator) {}

    async validate(input: any): Promise<void> {
        if (!this.passwordValidator.isStrongPassword(input[this.fieldName])) {
            throw new InvalidParamError('password is too week');
        }
    }
}
