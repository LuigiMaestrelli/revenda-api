import { UserImageUseCase } from '@/application/usecases/user/userImage';
import { IUserImageRepository } from '@/domain/repository/user/userImage';
import { CreateUserImageAttributes, UserImageAttributes } from 'domain/models/user/userImage';

type SutTypes = {
    userRepositoryStub: IUserImageRepository;
    sut: UserImageUseCase;
};

const makeUserImageRepositoryStub = (): IUserImageRepository => {
    class UserImageRepositoryStub implements IUserImageRepository {
        async setImage(imageData: CreateUserImageAttributes): Promise<UserImageAttributes> {
            return imageData;
        }

        async findById(id: string): Promise<UserImageAttributes> {
            return {
                id,
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 1000
            };
        }
    }

    return new UserImageRepositoryStub();
};

const makeSut = (): SutTypes => {
    const userRepositoryStub = makeUserImageRepositoryStub();
    const sut = new UserImageUseCase(userRepositoryStub);

    return {
        sut,
        userRepositoryStub
    };
};

describe('UserImage UseCase', () => {
    describe('setImage', () => {
        test('should call userImageRepository with correct values', async () => {
            const { sut, userRepositoryStub } = makeSut();
            const setImageSpy = jest.spyOn(userRepositoryStub, 'setImage');

            const data: CreateUserImageAttributes = {
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 1000
            };

            await sut.setImage(data);
            expect(setImageSpy).toBeCalledWith({
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 1000
            });
        });

        test('should throw if userImageRepository throws', async () => {
            const { sut, userRepositoryStub } = makeSut();
            jest.spyOn(userRepositoryStub, 'setImage').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const data: CreateUserImageAttributes = {
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 1000
            };

            const setImagePromise = sut.setImage(data);
            await expect(setImagePromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should return created image data', async () => {
            const { sut } = makeSut();

            const data: CreateUserImageAttributes = {
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 1000
            };

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
        test('should call userImageRepository with correct values', async () => {
            const { sut, userRepositoryStub } = makeSut();
            const findByIdSpy = jest.spyOn(userRepositoryStub, 'findById');

            await sut.findById('valid id');
            expect(findByIdSpy).toBeCalledWith('valid id');
        });

        test('should throw if userImageRepository throws', async () => {
            const { sut, userRepositoryStub } = makeSut();
            jest.spyOn(userRepositoryStub, 'findById').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const findByIdPromise = sut.findById('valid id');
            await expect(findByIdPromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should return located image data', async () => {
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
    });
});
