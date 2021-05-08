import { MissingParamError } from '@/shared/errors';
import { HttpRequest, IValidation } from '@/presentation/protocols';

export class RequiredParamValidation implements IValidation {
    constructor(private readonly paramName: string) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!httpRequest.params[this.paramName]) {
            throw new MissingParamError(this.paramName);
        }
    }
}
