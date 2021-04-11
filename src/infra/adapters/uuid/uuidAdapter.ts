import { v4 as uuidv4 } from 'uuid';
import { IdGenerator } from '@/infra/interfaces/idGenerator';

export class UUIDAdapter implements IdGenerator {
    async generate(): Promise<string> {
        return uuidv4();
    }
}
