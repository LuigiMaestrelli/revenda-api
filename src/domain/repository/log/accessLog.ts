import { AccessLogAttributes, CreateAccessLogAttributes } from '@/domain/models/log/accessLog';

export interface IAccessLogRepository {
    addAuthorized: (accessData: CreateAccessLogAttributes) => Promise<AccessLogAttributes>;
    addUnauthorized: (accessData: CreateAccessLogAttributes) => Promise<AccessLogAttributes>;
}
