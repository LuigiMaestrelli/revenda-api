import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';
import { makeSuccessResponse } from '@/shared/utils/http';

export class RootController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return makeSuccessResponse({
            revenda: true
        });
    }
}
