import { InvalidParamError } from '@/shared/errors';
import { IValidation, IPasswordValidator } from '@/presentation/protocols';

export class StrongPasswordValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly passwordValidator: IPasswordValidator) {}

    async validate(input: any): Promise<void> {
        if (!this.passwordValidator.isStrongPassword(input[this.fieldName])) {
            throw new InvalidParamError('password is too week');
        }
    }
}
