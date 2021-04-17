import { truncate } from '../../../../utils/database';
import { UserRepository } from '@/infra/db/repository/user/userRepository';
import { IdGenerator } from '@/infra/interfaces/idGenerator';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';

type SutTypes = {
    sut: UserRepository;
    idGenerator: IdGenerator;
};

const makeIdGenerator = (): IdGenerator => {
    return new UUIDAdapter();
};

const makeSut = (): SutTypes => {
    const idGenerator = makeIdGenerator();
    const sut = new UserRepository(idGenerator);
    return { sut, idGenerator };
};

describe('User Repository', () => {
    beforeEach(async () => {
        await truncate();
    });

    test('should create user', async () => {
        const { sut } = makeSut();

        const user = await sut.add({
            email: 'valid@email.com',
            name: 'valid name',
            password: 'valid password'
        });

        expect(user.id).toBeTruthy();
    });
});
