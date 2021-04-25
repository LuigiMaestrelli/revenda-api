import { InvalidParamError } from '@/shared/errors';
import { IValidation, IEmailValidator } from '@/presentation/protocols';

export class EmailValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly emailValidator: IEmailValidator) {}

    async validate(input: any): Promise<void> {
        if (!this.emailValidator.isValid(input[this.fieldName])) {
            throw new InvalidParamError(this.fieldName);
        }
    }
}
