import { MissingParamError } from '@/shared/errors';
import { IValidation } from '@/presentation/protocols';

export class RequiredFieldValidation implements IValidation {
    constructor(private readonly fieldName: string) {}

    async validate(input: any): Promise<void> {
        if (!input[this.fieldName]) {
            throw new MissingParamError(this.fieldName);
        }
    }
}
