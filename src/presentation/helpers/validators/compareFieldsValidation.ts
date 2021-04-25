import { InvalidParamError } from '@/shared/errors';
import { IValidation } from '@/presentation/protocols/validation';

export class CompareFieldsValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) {}

    async validate(input: any): Promise<void> {
        if (input[this.fieldName] !== input[this.fieldToCompareName]) {
            throw new InvalidParamError(this.fieldToCompareName);
        }
    }
}
