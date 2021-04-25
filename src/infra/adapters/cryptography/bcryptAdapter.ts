import bcrypt from 'bcrypt';
import { IHasher, IHashCompare } from '@/infra/protocols/cryptography';

const SALT_CONFIG = 12;

export class BcryptAdapter implements IHasher, IHashCompare {
    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, SALT_CONFIG);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }
}
