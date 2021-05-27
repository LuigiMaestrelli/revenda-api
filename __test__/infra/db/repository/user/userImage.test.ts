import faker from 'faker';
import { IUserRepository } from '@/domain/repository/user/user';
import { UserImageRepository } from '@/infra/db/repository/user/userImage';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { UserRepository } from '@/infra/db/repository/user/user';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { truncate } from '@test/utils/database';
import { UserAttributes } from '@/domain/models/user/user';
import UserModel from '@/infra/db/model/user/user';
import UserImageModel from '@/infra/db/model/user/userImage';

type SutTypes = {
    sut: UserImageRepository;
    userRepository: IUserRepository;
    idGeneratorStub: IIdGenerator;
};

const makeIdGenerator = (): IIdGenerator => {
    return new UUIDAdapter();
};

const makeSut = (): SutTypes => {
    const idGeneratorStub = makeIdGenerator();
    const userRepository = new UserRepository(idGeneratorStub);
    const sut = new UserImageRepository(userRepository);

    return { sut, userRepository, idGeneratorStub };
};

const createUser = async (): Promise<UserAttributes> => {
    const idGenerator = makeIdGenerator();
    const id = await idGenerator.generate();

    const email = faker.internet.email();
    const name = faker.name.firstName();
    const password = faker.internet.password();

    return await UserModel.create({
        id,
        email,
        name,
        password
    });
};

const createTestBuffer = (): Buffer => {
    return Buffer.from('Test data', 'utf8');
};

describe('User Repository', () => {
    beforeEach(async () => {
        await truncate();
    });

    describe('SetImage', () => {
        test('should create a new image record', async () => {
            const { sut } = makeSut();
            const user = await createUser();
            const buffer = createTestBuffer();

            const userImage = await sut.setImage({
                id: user.id,
                image: buffer,
                miniature: buffer,
                imageSize: 100,
                miniatureSize: 100,
                mimetype: 'valid mimetype',
                name: 'valid name'
            });

            expect(userImage.id).toBe(user.id);
            expect(userImage.name).toBe('valid name');
        });

        test('should update a image record', async () => {
            const { sut } = makeSut();
            const user = await createUser();
            const buffer = createTestBuffer();

            await UserImageModel.create({
                id: user.id,
                image: buffer,
                miniature: buffer,
                imageSize: 100,
                miniatureSize: 100,
                mimetype: 'valid mimetype',
                name: 'valid name'
            });

            await sut.setImage({
                id: user.id,
                image: buffer,
                miniature: buffer,
                imageSize: 100,
                miniatureSize: 100,
                mimetype: 'valid mimetype',
                name: 'new name'
            });

            const imageFind = await UserImageModel.findByPk(user.id);

            expect(imageFind.name).toBe('new name');
        });
    });

    describe('findById', () => {
        test('should return the created image', async () => {
            const { sut } = makeSut();
            const user = await createUser();
            const buffer = createTestBuffer();

            await UserImageModel.create({
                id: user.id,
                image: buffer,
                miniature: buffer,
                imageSize: 100,
                miniatureSize: 100,
                mimetype: 'valid mimetype',
                name: 'valid name'
            });

            const imageData = await sut.findById(user.id);

            expect(imageData.id).toBe(user.id);
            expect(imageData.name).toBe('valid name');
        });
    });
});
