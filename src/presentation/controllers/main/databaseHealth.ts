import { IController } from '@/presentation/protocols';
import { makeSuccessResponse, makeServerErrorResponse } from '@/shared/utils/http';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';
import database from '@/infra/db';

export class DatabaseHealthController implements IController {
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
