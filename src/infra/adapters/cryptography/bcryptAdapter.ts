import bcrypt from 'bcrypt';
import { Hasher, HashCompare } from '@/infra/interfaces/cryptography';

const SALT_CONFIG = 12;

export class BcryptAdapter implements Hasher, HashCompare {
    async hash(value: string): Promise<string> {
        return await bcrypt.hash(value, SALT_CONFIG);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }
}
