import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';
import { IAddErrorLogRepository } from '@/domain/repository/log/errorLog';

export class LogControllerDecorator implements Controller {
    constructor(
        private readonly controller: Controller,
        private readonly addErrorLogRepository: IAddErrorLogRepository
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
