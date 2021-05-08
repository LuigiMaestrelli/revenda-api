import { InvalidParamError } from '@/shared/errors';
import { IValidation, IEmailValidator, HttpRequest } from '@/presentation/protocols';

export class EmailValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly emailValidator: IEmailValidator) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!this.emailValidator.isValid(httpRequest.body[this.fieldName])) {
            throw new InvalidParamError(this.fieldName);
        }
    }
}
