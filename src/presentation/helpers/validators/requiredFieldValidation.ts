import { MissingParamError } from '@/shared/errors';
import { Validation } from '@/presentation/interfaces';

export class RequiredFieldValidation implements Validation {
    constructor(private readonly fieldName: string) {}

    async validate(input: any): Promise<void> {
        if (!input[this.fieldName]) {
            throw new MissingParamError(this.fieldName);
        }
    }
}
