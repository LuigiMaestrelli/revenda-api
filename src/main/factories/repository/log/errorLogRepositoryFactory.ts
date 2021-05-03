import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { ErrorLogRepository } from '@/infra/db/repository/log/errorLog';

export const makeErrorLogRepository = (): ErrorLogRepository => {
    const idGenerator = new UUIDAdapter();
    return new ErrorLogRepository(idGenerator);
};
