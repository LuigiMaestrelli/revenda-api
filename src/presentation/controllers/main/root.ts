import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';
import { makeSuccessResponse } from '@/presentation/helpers/httpHelper';

export class RootController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return makeSuccessResponse({
            revenda: true
        });
    }
}
