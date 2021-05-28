import { MissingParamError } from '@/shared/errors';
import { IValidation } from '@/presentation/protocols';
import { HttpRequest } from '@/domain/models/infra/http';

export class RequiredParamValidation implements IValidation {
    constructor(private readonly paramName: string) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!httpRequest.params[this.paramName]) {
            throw new MissingParamError(this.paramName);
        }
    }
}
