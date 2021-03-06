import faker from 'faker';
import { truncate } from '@test/utils/database';
import { UserRepository } from '@/infra/db/repository/user/user';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { NotFoundError } from '@/shared/errors/notFoundError';
import UserModel from '@/infra/db/model/user/userModel';

type SutTypes = {
    sut: UserRepository;
    idGeneratorStub: IIdGenerator;
};

const makeIdGenerator = (): IIdGenerator => {
    return new UUIDAdapter();
};

const makeSut = (): SutTypes => {
    const idGeneratorStub = makeIdGenerator();
    const sut = new UserRepository(idGeneratorStub);

    return { sut, idGeneratorStub };
};

describe('User Repository', () => {
    beforeEach(async () => {
        await truncate();
    });

    describe('Create', () => {
        test('should create user', async () => {
            const { sut } = makeSut();

            const user = await sut.add({
                email: faker.internet.email(),
                name: faker.name.firstName(),
                password: faker.internet.password()
            });

            expect(user.id).toBeTruthy();
        });

        test('should not create user without email', async () => {
            const { sut } = makeSut();

            const addPromise = sut.add({
                email: null,
                name: faker.name.firstName(),
                password: faker.internet.password()
            });

            await expect(addPromise).rejects.toThrow(new Error('notNull Violation: User`s e-mail cannot be null'));
        });

        test('should not create user with an email bigger than 200 characters', async () => {
            const { sut } = makeSut();

            const addPromise = sut.add({
                email: faker.random.alpha({ count: 201 }),
                name: faker.name.firstName(),
                password: faker.internet.password()
            });

            await expect(addPromise).rejects.toThrow(
                new Error('Validation error: User`s e-mail cannot be bigger than 200 characters')
            );
        });

        test('should not create user without name', async () => {
            const { sut } = makeSut();

            const addPromise = sut.add({
                email: faker.internet.email(),
                name: null,
                password: faker.internet.password()
            });

            await expect(addPromise).rejects.toThrow(new Error('notNull Violation: User`s name cannot be null'));
        });

        test('should not create user with an name bigger than 200 characters', async () => {
            const { sut } = makeSut();

            const addPromise = sut.add({
                email: faker.internet.email(),
                name: faker.random.alpha({ count: 201 }),
                password: faker.internet.password()
            });

            await expect(addPromise).rejects.toThrow(
                new Error('Validation error: User`s name cannot be bigger than 200 characters')
            );
        });

        test('should not create user without password', async () => {
            const { sut } = makeSut();

            const addPromise = sut.add({
                email: faker.internet.email(),
                name: faker.name.firstName(),
                password: null
            });

            await expect(addPromise).rejects.toThrow(new Error('notNull Violation: User`s password cannot be null'));
        });
    });

    describe('Update', () => {
        test('should throw if no user was found', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const updatePromise = sut.update(id, {
                name: 'new name'
            });

            await expect(updatePromise).rejects.toThrow(new NotFoundError('Data not found'));
        });

        test('should update only the user`s name', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const email = faker.internet.email();
            const name = faker.name.firstName();
            const password = faker.internet.password();

            await UserModel.create({
                id,
                email,
                name,
                password
            });

            const user = await sut.update(id, {
                name: 'new name'
            });

            const userFind = await sut.findById(id);

            expect(user.name).toBe('new name');
            expect(userFind.name).toBe('new name');
            expect(userFind.email).toBe(email);
            expect(userFind.password).toBe(password);
            expect(userFind.active).toBe(true);
        });

        test('should update only the user`s password', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const email = faker.internet.email();
            const name = faker.name.firstName();
            const password = faker.internet.password();

            await UserModel.create({
                id,
                email,
                name,
                password
            });

            const user = await sut.update(id, {
                password: 'new password'
            });

            const userFind = await sut.findById(id);

            expect(user.password).toBe('new password');
            expect(userFind.password).toBe('new password');
            expect(userFind.name).toBe(name);
            expect(userFind.email).toBe(email);
            expect(userFind.active).toBe(true);
        });

        test('should update only the user`s active', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const email = faker.internet.email();
            const name = faker.name.firstName();
            const password = faker.internet.password();

            await UserModel.create({
                id,
                email,
                name,
                password
            });

            const user = await sut.update(id, {
                active: false
            });

            const userFind = await sut.findById(id);

            expect(user.active).toBe(false);
            expect(userFind.active).toBe(false);
            expect(userFind.name).toBe(name);
            expect(userFind.email).toBe(email);
            expect(userFind.password).toBe(password);
        });
    });

    describe('Find by e-mail', () => {
        test('should find user by e-mail', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
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

        test('should return null if no user was found with an e-mail', async () => {
            const { sut } = makeSut();

            const email = faker.internet.email();
            const user = await sut.findUserByEmail(email);

            expect(user).toBeFalsy();
        });
    });

    describe('Find by id', () => {
        test('should find user by id', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            await UserModel.create({
                id: id,
                email: faker.internet.email(),
                name: faker.name.firstName(),
                password: faker.internet.password()
            });

            const user = await sut.findById(id);

            expect(user?.id).toBe(id);
        });

        test('should return null if no user was found with id', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const user = await sut.findById(id);

            expect(user).toBeFalsy();
        });
    });
});
