import { IController, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { IErrorLogRepository } from '@/domain/repository/log/errorLog';

export class LogControllerDecorator implements IController {
    constructor(
        private readonly controller: IController,
        private readonly addErrorLogRepository: IErrorLogRepository
    ) {}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const response = await this.controller.handle(httpRequest);

        if (response.statusCode === 500) {
            let message: string = response.body.message;
            if (response.body.parentMessage) {
                const parentMessage: string = response.body.parentMessage;
                message = `${message} -> ${parentMessage}`;
            }

            await this.addErrorLogRepository.add({
                location: this.controller.constructor.name,
                message: message,
                stack: response.body.details
            });
        }

        return response;
    }
}
