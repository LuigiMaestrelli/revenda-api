import { InvalidParamError } from '@/shared/errors';
import { IValidation, IPasswordValidator, HttpRequest } from '@/presentation/protocols';

export class StrongPasswordValidation implements IValidation {
    constructor(private readonly fieldName: string, private readonly passwordValidator: IPasswordValidator) {}

    async validate(httpRequest: HttpRequest): Promise<void> {
        if (!this.passwordValidator.isStrongPassword(httpRequest.body[this.fieldName])) {
            throw new InvalidParamError('password is too week');
        }
    }
}
