import { CreateErrorLogAttributes, ErrorLogAttributes } from '@/domain/models/log/errorLog';
import { IErrorLogRepository } from '@/domain/repository/log/errorLog';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import ErrorLogModel from '@/infra/db/model/log/errorLogModel';

export class ErrorLogRepository implements IErrorLogRepository {
    constructor(private readonly idGenerator: IIdGenerator) {}

    async add(errorData: CreateErrorLogAttributes): Promise<ErrorLogAttributes> {
        const id = await this.idGenerator.generate();

        return await ErrorLogModel.create({
            id,
            ...errorData
        });
    }
}
