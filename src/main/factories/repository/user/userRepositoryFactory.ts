import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { UserRepository } from '@/infra/db/repository/user/userRepository';

export const makeUserRepository = (): UserRepository => {
    const idGenerator = new UUIDAdapter();
    return new UserRepository(idGenerator);
};
