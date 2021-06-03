import { IBrandRepository } from '@/domain/repository/brand/brand';
import { BrandUseCase } from '@/application/usecases/brand/brand';
import { makeBrandRepositoryStub } from '@test/utils/mocks/repository/brand';

type SutTypes = {
    brandRepositoryStub: IBrandRepository;
    sut: BrandUseCase;
};

const makeSut = (): SutTypes => {
    const brandRepositoryStub = makeBrandRepositoryStub();
    const sut = new BrandUseCase(brandRepositoryStub);

    return {
        brandRepositoryStub,
        sut
    };
};

describe('Brand UseCase', () => {
    describe('Add', () => {
        test('should call add with correct values', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            const addSpy = jest.spyOn(brandRepositoryStub, 'add');

            await sut.add({
                description: 'valid description'
            });

            expect(addSpy).toHaveBeenCalledWith({
                description: 'valid description'
            });
        });

        test('should throw if add throws', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            jest.spyOn(brandRepositoryStub, 'add').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const addPromise = sut.add({
                description: 'valid description'
            });

            await expect(addPromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should return created brand values', async () => {
            const { sut } = makeSut();

            const brand = await sut.add({
                description: 'valid description'
            });

            expect(brand).toEqual({
                id: 'valid id',
                description: 'valid description',
                active: true
            });
        });
    });

    describe('Update', () => {
        test('should call update with correct values', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            const addSpy = jest.spyOn(brandRepositoryStub, 'update');

            await sut.update('valid id', {
                description: 'valid description'
            });

            expect(addSpy).toHaveBeenCalledWith('valid id', {
                description: 'valid description'
            });
        });

        test('should throw if update throws', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            jest.spyOn(brandRepositoryStub, 'update').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const updatePromise = sut.update('valid id', {
                description: 'valid description'
            });

            await expect(updatePromise).rejects.toThrow(new Error('Test throw'));
        });

        test('should return updated brand values', async () => {
            const { sut } = makeSut();

            const brand = await sut.update('valid id', {
                description: 'new description'
            });

            expect(brand).toEqual({
                id: 'valid id',
                description: 'new description',
                active: true
            });
        });
    });

    describe('Active', () => {
        test('should call update with correct values', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            const updateSpy = jest.spyOn(brandRepositoryStub, 'update');

            await sut.active('valid id');
            expect(updateSpy).toHaveBeenCalledWith('valid id', {
                active: true
            });
        });

        test('should throw if update throws', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            jest.spyOn(brandRepositoryStub, 'update').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const updatePromise = sut.active('valid id');
            await expect(updatePromise).rejects.toThrow(new Error('Test throw'));
        });
    });

    describe('Inactive', () => {
        test('should call update with correct values', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            const updateSpy = jest.spyOn(brandRepositoryStub, 'update');

            await sut.inactive('valid id');
            expect(updateSpy).toHaveBeenCalledWith('valid id', {
                active: false
            });
        });

        test('should throw if update throws', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            jest.spyOn(brandRepositoryStub, 'update').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const updatePromise = sut.inactive('valid id');
            await expect(updatePromise).rejects.toThrow(new Error('Test throw'));
        });
    });

    describe('Delete', () => {
        test('should call delete with correct values', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            const deleteSpy = jest.spyOn(brandRepositoryStub, 'delete');

            await sut.delete('valid id');
            expect(deleteSpy).toHaveBeenCalledWith('valid id');
        });

        test('should throw if delete throws', async () => {
            const { sut, brandRepositoryStub } = makeSut();
            jest.spyOn(brandRepositoryStub, 'delete').mockImplementationOnce(() => {
                throw new Error('Test throw');
            });

            const deletePromise = sut.delete('valid id');
            await expect(deletePromise).rejects.toThrow(new Error('Test throw'));
        });
    });
});
