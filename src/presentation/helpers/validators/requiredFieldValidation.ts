import { MissingParamError } from '@/shared/errors';
import { Validation } from '@/presentation/interfaces';

export class RequiredFieldValidation implements Validation {
    constructor(private readonly fieldName: string) {}

    validate(input: any): Error | null {
        if (!input[this.fieldName]) {
            return new MissingParamError(this.fieldName);
        }

        return null;
    }
}
