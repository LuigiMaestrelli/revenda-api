import { MissingParamError } from '@/shared/errors';
import { IValidation } from '@/presentation/protocols';
import { HttpRequest } from '@/domain/models/infra/http';

export class RequiredFieldValidation implements IValidation {
    constructor(private readonly fieldName: string) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!httpRequest.body[this.fieldName]) {
            throw new MissingParamError(this.fieldName);
        }
    }
}
