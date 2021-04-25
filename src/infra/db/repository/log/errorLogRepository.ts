import { CreateErrorLogAttributes, ErrorLogAttributes } from '@/domain/models/log/errorLog';
import { IAddErrorLogRepository } from '@/domain/repository/log/errorLog';
import { IdGenerator } from '@/infra/interfaces/idGenerator';
import ErrorLogModel from '@/infra/db/model/log/errorLogModel';

export class ErrorLogRepository implements IAddErrorLogRepository {
    constructor(private readonly idGenerator: IdGenerator) {}

    async add(errorData: CreateErrorLogAttributes): Promise<ErrorLogAttributes> {
        const id = await this.idGenerator.generate();

        return await ErrorLogModel.create({
            id,
            ...errorData
        });
    }
}
