import { InvalidParamError } from '@/shared/errors';
import { IValidation, IEmailValidator } from '@/presentation/protocols';
import { HttpRequest } from '@/domain/models/infra/http';

export class EmailValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly emailValidator: IEmailValidator) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!this.emailValidator.isValid(httpRequest.body[this.fieldName])) {
            throw new InvalidParamError(this.fieldName);
        }
    }
}
