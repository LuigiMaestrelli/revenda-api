import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';

export class SignInController implements IController {
    constructor(private readonly validation: IValidation, private readonly generateAuth: IGenerateAuthentication) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { body, networkAccess } = httpRequest;
            const authData = await this.generateAuth.auth(body, networkAccess);

            return makeSuccessResponse(authData);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
