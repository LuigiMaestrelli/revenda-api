import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';
import { makeSuccessResponse, makeServerErrorResponse } from '@/presentation/helpers/httpHelper';

export class ServerHealthController implements Controller {
    getProcessUpTime(): number {
        return process.uptime();
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            return makeSuccessResponse({
                uptime: this.getProcessUpTime(),
                message: 'OK',
                timestamp: new Date(),
                env: process.env.NODE_ENV
            });
        } catch (err) {
            return makeServerErrorResponse(err);
        }
    }
}
