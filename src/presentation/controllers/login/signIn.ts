import { IController, HttpRequest, HttpResponse, IValidation } from '@/presentation/protocols';
import { makeSuccessResponse, makeErrorResponse } from '@/shared/utils/http';
import { IGenerateAuthApplication } from '@/domain/usecases/auth/authentication';

export class SignInController implements IController {
    constructor(private readonly validation: IValidation, private readonly generateAuth: IGenerateAuthApplication) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { body } = httpRequest;

            await this.validation.validate(body);

            const authData = await this.generateAuth.auth(body);

            return makeSuccessResponse(authData);
        } catch (ex) {
            return makeErrorResponse(ex);
        }
    }
}
