import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { UserImageRepository } from '@/infra/db/repository/user/userImage';
import { makeUserRepositoryStub } from '@test/utils/mocks/repository/user';
import { IUserRepository } from '@/domain/repository/user/user';
import { NotFoundError } from '@/shared/errors/notFoundError';
import UserImageModel from '@/infra/db/model/user/userImage';

type SutTypes = {
    sut: UserImageRepository;
    userRepository: IUserRepository;
};

jest.mock('@/infra/db/model/user/userImage', () => ({
    async upsert(data: CreateUserImageAttributes): Promise<[UserImageAttributes, boolean]> {
        return [data, true];
    },

    async findByPk(id: string): Promise<UserImageAttributes> {
        return {
            id: 'valid id',
            name: 'valid name',
            image: null,
            imageSize: 1000,
            mimetype: 'valid mimetype',
            miniature: null,
            miniatureSize: 1000
        };
    }
}));

const makeSut = (): SutTypes => {
    const userRepository = makeUserRepositoryStub();
    const sut = new UserImageRepository(userRepository);

    return { sut, userRepository };
};

const makeValidCreateImageData = (): CreateUserImageAttributes => {
    return {
        id: 'valid id',
        name: 'valid name',
        image: null,
        imageSize: 1000,
        mimetype: 'valid mimetype',
        miniature: null,
        miniatureSize: 1000
    };
};

describe('UserImage Repository', () => {
    describe('setImage', () => {
        test('should call userRepository with correct values', async () => {
            const { sut, userRepository } = makeSut();
            const findByIdSpy = jest.spyOn(userRepository, 'findById');

            const data = makeValidCreateImageData();
            await sut.setImage(data);

            expect(findByIdSpy).toBeCalledWith('valid id');
        });

        test('should call throw if userRepository throws', async () => {
            const { sut, userRepository } = makeSut();
            jest.spyOn(userRepository, 'findById').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const data = makeValidCreateImageData();
            const setImagePromise = sut.setImage(data);

            await expect(setImagePromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should call throw if no user with id was found', async () => {
            const { sut, userRepository } = makeSut();
            jest.spyOn(userRepository, 'findById').mockImplementationOnce(() => {
                return null;
            });

            const data = makeValidCreateImageData();
            const setImagePromise = sut.setImage(data);

            await expect(setImagePromise).rejects.toThrow(new NotFoundError('User not found'));
        });

        test('should return created image data', async () => {
            const { sut } = makeSut();

            const data = makeValidCreateImageData();
            const imageData = await sut.setImage(data);

            expect(imageData).toEqual({
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 1000
            });
        });
    });

    describe('findById', () => {
        test('should return image data', async () => {
            const { sut } = makeSut();

            const imageData = await sut.findById('valid id');
            expect(imageData).toEqual({
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 1000
            });
        });

        test('should throw if no image was found with id', async () => {
            const { sut } = makeSut();

            jest.spyOn(UserImageModel, 'findByPk').mockReturnValueOnce(null);

            const findByIdPromise = sut.findById('valid id');
            await expect(findByIdPromise).rejects.toThrow(new NotFoundError('Image not found'));
        });
    });
});
