import { IController, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { makeSuccessResponse } from '@/shared/utils/http';

export class AuthHealthController implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return makeSuccessResponse(httpRequest.auth);
    }
}
