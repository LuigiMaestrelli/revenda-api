import { IController } from '@/presentation/protocols';
import { makeSuccessResponse } from '@/shared/utils/http';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class AuthHealthController implements IController {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return makeSuccessResponse(httpRequest.auth);
    }
}
