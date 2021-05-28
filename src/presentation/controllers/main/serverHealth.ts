import { IController } from '@/presentation/protocols';
import { makeSuccessResponse, makeServerErrorResponse } from '@/shared/utils/http';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export class ServerHealthController implements IController {
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
