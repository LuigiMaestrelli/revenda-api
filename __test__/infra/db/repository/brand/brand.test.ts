import faker from 'faker';
import { truncate } from '@test/utils/database';
import { BrandRepository } from '@/infra/db/repository/brand/brand';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { UUIDAdapter } from '@/infra/adapters/uuid/uuidAdapter';
import { NotFoundError } from '@/shared/errors/notFoundError';
import BrandModel from '@/infra/db/model/general/brandModel';

type SutTypes = {
    sut: BrandRepository;
    idGeneratorStub: IIdGenerator;
};

const makeIdGenerator = (): IIdGenerator => {
    return new UUIDAdapter();
};

const makeSut = (): SutTypes => {
    const idGeneratorStub = makeIdGenerator();
    const sut = new BrandRepository(idGeneratorStub);

    return { sut, idGeneratorStub };
};

describe('Brand Repository', () => {
    beforeEach(async () => {
        await truncate();
    });

    describe('Create', () => {
        test('should create brand', async () => {
            const { sut } = makeSut();

            const brand = await sut.add({
                description: faker.random.alpha({ count: 30 })
            });

            expect(brand.id).toBeTruthy();
        });

        test('should create brand with active true as default', async () => {
            const { sut } = makeSut();

            const brand = await sut.add({
                description: faker.random.alpha({ count: 30 })
            });

            expect(brand.active).toBe(true);
        });

        test('should not create brand without a description', async () => {
            const { sut } = makeSut();

            const addBrandPromise = sut.add({
                description: null
            });

            await expect(addBrandPromise).rejects.toThrow(
                new Error('notNull Violation: Brand`s description cannot be null')
            );
        });

        test('should not create brand with a description bigger than 200 characters', async () => {
            const { sut } = makeSut();

            const addBrandPromise = sut.add({
                description: faker.random.alpha({ count: 201 })
            });

            await expect(addBrandPromise).rejects.toThrow(
                new Error('Validation error: Brand`s description cannot be bigger than 200 characters')
            );
        });
    });

    describe('Update', () => {
        test('should update the brand`s description', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            await BrandModel.create({
                id: id,
                description: faker.random.alpha({ count: 30 })
            });

            const newDescription = faker.random.alpha({ count: 30 });
            await sut.update(id, {
                description: newDescription
            });

            const brandFind = await BrandModel.findByPk(id);

            await expect(brandFind.description).toBe(newDescription);
        });

        test('should throw if no brand was found', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const updatePromise = sut.update(id, {
                description: faker.random.alpha({ count: 30 })
            });

            await expect(updatePromise).rejects.toThrow(new NotFoundError('Data not found'));
        });

        test('should not update brand without a description', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            await BrandModel.create({
                id: id,
                description: faker.random.alpha({ count: 30 })
            });

            const updateBrandPromise = sut.update(id, {
                description: null
            });

            await expect(updateBrandPromise).rejects.toThrow(
                new Error('notNull Violation: Brand`s description cannot be null')
            );
        });

        test('should not update brand with a description bigger than 200 characters', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            await BrandModel.create({
                id: id,
                description: faker.random.alpha({ count: 30 })
            });

            const updateBrandPromise = sut.update(id, {
                description: faker.random.alpha({ count: 201 })
            });

            await expect(updateBrandPromise).rejects.toThrow(
                new Error('Validation error: Brand`s description cannot be bigger than 200 characters')
            );
        });
    });

    describe('Find by id', () => {
        test('should find brand by id', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            await BrandModel.create({
                id: id,
                description: faker.random.alpha({ count: 30 })
            });

            const brand = await sut.findById(id);
            expect(brand?.id).toBe(id);
        });

        test('should return null if no brand was found with id', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const brand = await sut.findById(id);

            expect(brand).toBeFalsy();
        });
    });

    describe('Delete', () => {
        test('should delete brand', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            await BrandModel.create({
                id: id,
                description: faker.random.alpha({ count: 30 })
            });

            await sut.delete(id);

            const brandFind = await BrandModel.findByPk(id);
            expect(brandFind).toBeFalsy();
        });

        test('should throw if no brand as found', async () => {
            const { sut, idGeneratorStub } = makeSut();

            const id = await idGeneratorStub.generate();
            const updatePromise = sut.delete(id);

            await expect(updatePromise).rejects.toThrow(new NotFoundError('Data not found'));
        });
    });
});
