import { MissingParamError } from '@/shared/errors';
import { HttpRequest, IValidation } from '@/presentation/protocols';

export class RequiredFieldValidation implements IValidation {
    constructor(private readonly fieldName: string) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!httpRequest.body[this.fieldName]) {
            throw new MissingParamError(this.fieldName);
        }
    }
}
