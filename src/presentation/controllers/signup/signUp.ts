import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/interfaces';
import { ServerError } from '@/shared/errors';
import {
    makeBadRequestResponse,
    makeSuccessResponse,
    makeServerErrorResponse
} from '@/presentation/helpers/httpHelper';
import { IAddUserApplication } from '@/domain/usecases/user/addUser';

export class SignUpController implements Controller {
    constructor(private readonly validation: Validation, private readonly addUserApplication: IAddUserApplication) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { body } = httpRequest;

            const error = this.validation.validate(body);
            if (error) {
                return makeBadRequestResponse(error);
            }

            const user = await this.addUserApplication.add({
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
