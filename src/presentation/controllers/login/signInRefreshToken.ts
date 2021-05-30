import { IController, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IGenerateAuthentication } from '@/domain/usecases/auth/authentication';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class SignInRefreshTokenController implements IController {
    constructor(private readonly validation: IValidation, private readonly generateAuth: IGenerateAuthentication) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.validation.validate(httpRequest);

            const { body } = httpRequest;
            const authData = await this.generateAuth.refreshAuth(body.refreshToken);

            return makeSuccessResponse(authData);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
