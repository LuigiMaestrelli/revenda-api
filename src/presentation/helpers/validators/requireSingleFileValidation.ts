import { MissingParamError } from '@/shared/errors';
import { IValidation } from '@/presentation/protocols';
import { HttpRequest } from '@/domain/models/infra/http';

export class RequireSingleFileValidation implements IValidation {
    constructor(private readonly fileName: string) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!httpRequest.file) {
            throw new MissingParamError(this.fileName);
        }
    }
}
