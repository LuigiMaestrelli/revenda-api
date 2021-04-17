import { Controller, HttpRequest, HttpResponse, Validation } from '@/presentation/interfaces';
import { makeSuccessResponse, makeErrorResponse } from '@/presentation/helpers/httpHelper';
import { IAddUserApplication } from '@/domain/usecases/user/user';

export class SignUpController implements Controller {
    constructor(private readonly validation: Validation, private readonly addUserApplication: IAddUserApplication) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { body } = httpRequest;

            await this.validation.validate(body);

            const user = await this.addUserApplication.add({
                name: body.name,
                email: body.email,
                password: body.password
            });

            return makeSuccessResponse(user);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
