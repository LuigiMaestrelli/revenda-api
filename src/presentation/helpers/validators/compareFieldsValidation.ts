import { InvalidParamError } from '@/shared/errors';
import { IValidation } from '@/presentation/protocols/validation';
import { HttpRequest } from '@/presentation/protocols';

export class CompareFieldsValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        const { body } = httpRequest;

        if (body[this.fieldName] !== body[this.fieldToCompareName]) {
            throw new InvalidParamError(this.fieldToCompareName);
        }
    }
}
