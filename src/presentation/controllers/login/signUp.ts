import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IAddUserApplication } from '@/domain/usecases/user/user';

export class SignUpController implements IController {
    constructor(private readonly validation: IValidation, private readonly addUserApplication: IAddUserApplication) {}

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
