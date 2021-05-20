import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { AccessLogRepository } from '@/infra/db/repository/log/accessLog';

export const makeAccessLogRepository = (): AccessLogRepository => {
    const idGenerator = new UUIDAdapter();
    return new AccessLogRepository(idGenerator);
};
