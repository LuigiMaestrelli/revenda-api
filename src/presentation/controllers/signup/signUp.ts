import { Controller, HttpRequest, HttpResponse, EmailValidator, PasswordValidator } from '@/presentation/interfaces';
import { InvalidParamError, MissingParamError, ServerError } from '@/shared/errors';
import {
    makeBadRequestResponse,
    makeSuccessResponse,
    makeServerErrorResponse
} from '@/presentation/helpers/httpHelper';
import { IAddUserApplication } from '@/domain/usecases/user/addUser';

export class SignUpController implements Controller {
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly passwordValidator: PasswordValidator,
        private readonly addUser: IAddUserApplication
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { body } = httpRequest;

            if (!body.name) {
                return makeBadRequestResponse(new MissingParamError('name'));
            }

            if (!body.email) {
                return makeBadRequestResponse(new MissingParamError('email'));
            }

            if (!body.password) {
                return makeBadRequestResponse(new MissingParamError('password'));
            }

            if (!body.passwordConfirmation) {
                return makeBadRequestResponse(new MissingParamError('passwordConfirmation'));
            }

            if (body.password !== body.passwordConfirmation) {
                return makeBadRequestResponse(new InvalidParamError('password'));
            }

            if (!this.emailValidator.isValid(body.email)) {
                return makeBadRequestResponse(new InvalidParamError('email'));
            }

            if (!this.passwordValidator.isStrongPassword(body.password)) {
                return makeBadRequestResponse(new InvalidParamError('password is too week'));
            }

            const user = await this.addUser.add({
                name: body.name,
                email: body.email,
                password: body.password
            });

            return makeSuccessResponse(user);
        } catch (ex) {
            return makeServerErrorResponse(new ServerError(ex.message, ex));
        }
    }
}
