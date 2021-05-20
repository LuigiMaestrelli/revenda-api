import { AccessLogAttributes, CreateAccessLogAttributes } from '@/domain/models/log/accessLog';

export interface IAccessLogRepository {
    add: (accessData: CreateAccessLogAttributes) => Promise<AccessLogAttributes>;
}
