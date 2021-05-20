import { CreateAccessLogAttributes, AccessLogAttributes } from '@/domain/models/log/accessLog';
import { IAccessLogRepository } from '@/domain/repository/log/accessLog';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import AccessLogModel from '../../model/log/accessLog';

export class AccessLogRepository implements IAccessLogRepository {
    constructor(private readonly idGenerator: IIdGenerator) {}

    async addAuthorized(accessData: CreateAccessLogAttributes): Promise<AccessLogAttributes> {
        const id = await this.idGenerator.generate();

        return await AccessLogModel.create({
            id,
            authorized: true,
            ...accessData
        });
    }

    async addUnauthorized(accessData: CreateAccessLogAttributes): Promise<AccessLogAttributes> {
        const id = await this.idGenerator.generate();

        return await AccessLogModel.create({
            id,
            authorized: false,
            ...accessData
        });
    }
}
