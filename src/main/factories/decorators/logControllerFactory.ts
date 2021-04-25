import { makeErrorLogRepository } from '@/main/factories/repository/log/errorLogRepositoryFactory';
import { LogControllerDecorator } from '@/main/decorators/logControllerDecorator';
import { Controller } from '@/presentation/interfaces';

export const makeLogControllerDecorator = (controller: Controller): Controller => {
    const errorLogRepository = makeErrorLogRepository();

    return new LogControllerDecorator(controller, errorLogRepository);
};
