import { InvalidParamError } from '@/shared/errors';
import { Validation } from '@/presentation/interfaces/validation';

export class CompareFieldsValidation implements Validation {
    constructor(private readonly fieldName: string, private readonly fieldToCompareName: string) {}

    async validate(input: any): Promise<void> {
        if (input[this.fieldName] !== input[this.fieldToCompareName]) {
            throw new InvalidParamError(this.fieldToCompareName);
        }
    }
}
