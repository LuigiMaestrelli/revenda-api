import bcrypt from 'bcrypt';
import { Hasher, HashCompare } from '@/application/interfaces/cryptography';

const SALT_CONFIG = 12;

export class BcryptAdapter implements Hasher, HashCompare {
    async hash(value: string): Promise<string> {
        const hash = await bcrypt.hash(value, SALT_CONFIG);
        return hash;
    }

    async compare(value: string, hash: string): Promise<boolean> {
        const isValid = await bcrypt.compare(value, hash);
        return isValid;
    }
}
