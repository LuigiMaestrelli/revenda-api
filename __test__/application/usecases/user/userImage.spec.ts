import { UserImageUseCase } from '@/application/usecases/user/userImage';
import { IUserImageRepository } from '@/domain/repository/user/userImage';
import { CreateUserImageAttributes, UserImageAttributes } from '@/domain/models/user/userImage';
import { NotFoundError } from '@/shared/errors/notFoundError';
import { HttpUploadFile } from '@/domain/models/infra/http';
import { IImageManipulation } from '@/infra/protocols/imageManipulation';

type SutTypes = {
    userRepositoryStub: IUserImageRepository;
    imageManipulationStub: IImageManipulation;
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

const makeImageManipulation = (): IImageManipulation => {
    class ImageManipulationStub implements IImageManipulation {
        async resize(imageBuffer: Buffer, size: number): Promise<Buffer> {
            return imageBuffer;
        }

        async getImageSize(imageBuffer: Buffer): Promise<number> {
            return 150;
        }
    }

    return new ImageManipulationStub();
};

const makeSut = (): SutTypes => {
    const userRepositoryStub = makeUserImageRepositoryStub();
    const imageManipulationStub = makeImageManipulation();
    const sut = new UserImageUseCase(userRepositoryStub, imageManipulationStub);

    return {
        sut,
        userRepositoryStub,
        imageManipulationStub
    };
};

const createTestBuffer = (): Buffer => {
    return Buffer.from('Test data', 'utf8');
};

describe('UserImage UseCase', () => {
    describe('setImage', () => {
        test('should call resize with correct values', async () => {
            const { sut, imageManipulationStub } = makeSut();
            const resizeSpy = jest.spyOn(imageManipulationStub, 'resize');
            const buffer = createTestBuffer();

            const data: HttpUploadFile = {
                fieldname: 'valid fieldname',
                mimetype: 'valid mimetype',
                originalname: 'valid name',
                size: 1000,
                buffer: buffer
            };

            await sut.setImage('valid id', data);
            expect(resizeSpy).toBeCalledWith(buffer, 300);
        });

        test('should throw if resize throws', async () => {
            const { sut, imageManipulationStub } = makeSut();
            jest.spyOn(imageManipulationStub, 'resize').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });
            const buffer = createTestBuffer();

            const data: HttpUploadFile = {
                fieldname: 'valid fieldname',
                mimetype: 'valid mimetype',
                originalname: 'valid name',
                size: 1000,
                buffer: buffer
            };

            const setImagePromise = sut.setImage('valid id', data);
            await expect(setImagePromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should call getImageSize with correct values', async () => {
            const { sut, imageManipulationStub } = makeSut();
            const getImageSizeSpy = jest.spyOn(imageManipulationStub, 'getImageSize');
            const buffer = createTestBuffer();

            const data: HttpUploadFile = {
                fieldname: 'valid fieldname',
                mimetype: 'valid mimetype',
                originalname: 'valid name',
                size: 1000,
                buffer: buffer
            };

            await sut.setImage('valid id', data);
            expect(getImageSizeSpy).toBeCalledWith(buffer);
        });

        test('should throw if getImageSize throws', async () => {
            const { sut, imageManipulationStub } = makeSut();
            jest.spyOn(imageManipulationStub, 'getImageSize').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });
            const buffer = createTestBuffer();

            const data: HttpUploadFile = {
                fieldname: 'valid fieldname',
                mimetype: 'valid mimetype',
                originalname: 'valid name',
                size: 1000,
                buffer: buffer
            };

            const setImagePromise = sut.setImage('valid id', data);
            await expect(setImagePromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should call userImageRepository with correct values', async () => {
            const { sut, userRepositoryStub } = makeSut();
            const setImageSpy = jest.spyOn(userRepositoryStub, 'setImage');

            const data: HttpUploadFile = {
                fieldname: 'valid fieldname',
                mimetype: 'valid mimetype',
                originalname: 'valid name',
                size: 1000,
                buffer: null
            };

            await sut.setImage('valid id', data);
            expect(setImageSpy).toBeCalledWith({
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 150
            });
        });

        test('should throw if userImageRepository throws', async () => {
            const { sut, userRepositoryStub } = makeSut();
            jest.spyOn(userRepositoryStub, 'setImage').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const data: HttpUploadFile = {
                fieldname: 'valid fieldname',
                mimetype: 'valid mimetype',
                originalname: 'valid name',
                size: 1000,
                buffer: null
            };

            const setImagePromise = sut.setImage('valid id', data);
            await expect(setImagePromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should return created image data', async () => {
            const { sut } = makeSut();

            const data: HttpUploadFile = {
                fieldname: 'valid fieldname',
                mimetype: 'valid mimetype',
                originalname: 'valid name',
                size: 1000,
                buffer: null
            };

            const imageData = await sut.setImage('valid id', data);
            expect(imageData).toEqual({
                id: 'valid id',
                name: 'valid name',
                image: null,
                imageSize: 1000,
                mimetype: 'valid mimetype',
                miniature: null,
                miniatureSize: 150
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

        test('should throw NotFound if no image was found', async () => {
            const { sut, userRepositoryStub } = makeSut();

            jest.spyOn(userRepositoryStub, 'findById').mockReturnValueOnce(null);

            const findByIdPromise = sut.findById('valid id');
            await expect(findByIdPromise).rejects.toThrow(new NotFoundError('Image not found'));
        });
    });
});
