import { makeErrorLogRepository } from '@/main/factories/repository/log/errorLogRepositoryFactory';
import { LogControllerDecorator } from '@/main/decorators/logControllerDecorator';
import { IController } from '@/presentation/protocols';

export const makeLogControllerDecorator = (controller: IController): IController => {
    const errorLogRepository = makeErrorLogRepository();

    return new LogControllerDecorator(controller, errorLogRepository);
};
