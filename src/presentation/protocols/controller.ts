import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export interface IController {
    handle: (httpRequest: HttpRequest) => Promise<HttpResponse>;
}
