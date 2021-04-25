import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';
import { makeSuccessResponse, makeServerErrorResponse } from '@/shared/utils/http';
import database from '@/infra/db';

export class DatabaseHealthController implements Controller {
    async connectDatabase(): Promise<void> {
        await database.authenticate();
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            await this.connectDatabase();

            return makeSuccessResponse({
                status: 'Database connected'
            });
        } catch (err) {
            return makeServerErrorResponse(err);
        }
    }
}
