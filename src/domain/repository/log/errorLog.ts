import { ErrorLogAttributes, CreateErrorLogAttributes } from '@/domain/models/log/errorLog';

export interface IErrorLogRepository {
    add: (errorData: CreateErrorLogAttributes) => Promise<ErrorLogAttributes>;
}
