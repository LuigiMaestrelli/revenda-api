import { InvalidParamError } from '@/shared/errors';
import { IValidation, IPasswordValidator } from '@/presentation/protocols';
import { HttpRequest } from '@/domain/models/infra/http';

export class StrongPasswordValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly passwordValidator: IPasswordValidator) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!this.passwordValidator.isStrongPassword(httpRequest.body[this.fieldName])) {
            throw new InvalidParamError('password is too week');
        }
    }
}
