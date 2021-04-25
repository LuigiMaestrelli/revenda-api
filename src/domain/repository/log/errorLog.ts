import { ErrorLogAttributes, CreateErrorLogAttributes } from '@/domain/models/log/errorLog';

export interface IAddErrorLogRepository {
    add: (errorData: CreateErrorLogAttributes) => Promise<ErrorLogAttributes>;
}
