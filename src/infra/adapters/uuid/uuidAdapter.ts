import { v4 as uuidv4 } from 'uuid';
import { IIdGenerator } from '@/infra/protocols/idGenerator';

export class UUIDAdapter implements IIdGenerator {
    async generate(): Promise<string> {
        return uuidv4();
    }
}
