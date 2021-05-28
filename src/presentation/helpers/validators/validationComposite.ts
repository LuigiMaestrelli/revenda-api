import { HttpRequest } from '@/domain/models/infra/http';
import { IValidation } from '@/presentation/protocols/validation';

export class ValidationComposite implements IValidation {
    constructor(private readonly validations: IValidation[]) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        for (const validation of this.validations) {
            await validation.validate(httpRequest);
        }
    }
}
