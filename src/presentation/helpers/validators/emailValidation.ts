import { InvalidParamError } from '@/shared/errors';
import { Validation, EmailValidator } from '@/presentation/interfaces';

export class EmailValidation implements Validation {
    constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidator) {}

    async validate(input: any): Promise<void> {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
            throw new InvalidParamError(this.fieldName);
        }
    }
}
