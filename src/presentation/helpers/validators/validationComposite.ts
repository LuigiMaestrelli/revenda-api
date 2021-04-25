import { IValidation } from '@/presentation/protocols/validation';

export class ValidationComposite implements IValidation {
    constructor(private readonly validations: IValidation[]) {}

    async validate(input: any): Promise<void> {
        for (const validation of this.validations) {
            await validation.validate(input);
        }
    }
}
