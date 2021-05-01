import faker from 'faker';
import { truncate } from '@test/utils/database';
import { UserRepository } from '@/infra/db/repository/user/userRepository';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import UserModel from '@/infra/db/model/user/userModel';

type SutTypes = {
    sut: UserRepository;
    idGenerator: IIdGenerator;
};

const makeIdGenerator = (): IIdGenerator => {
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
            email: faker.internet.email(),
            name: faker.name.firstName(),
            password: faker.internet.password()
        });

        expect(user.id).toBeTruthy();
    });

    test('should find user by e-mail', async () => {
        const { sut, idGenerator } = makeSut();

        const id = await idGenerator.generate();
        const email = faker.internet.email();

        await UserModel.create({
            id: id,
            email: email,
            name: faker.name.firstName(),
            password: faker.internet.password()
        });

        const user = await sut.findUserByEmail(email);

        expect(user?.id).toBe(id);
    });

    test('should find user by id', async () => {
        const { sut, idGenerator } = makeSut();

        const id = await idGenerator.generate();
        await UserModel.create({
            id: id,
            email: faker.internet.email(),
            name: faker.name.firstName(),
            password: faker.internet.password()
        });

        const user = await sut.findById(id);

        expect(user?.id).toBe(id);
    });
});
