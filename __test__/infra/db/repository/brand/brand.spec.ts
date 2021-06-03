import { BrandRepository } from '@/infra/db/repository/brand/brand';
import { IIdGenerator } from '@/infra/protocols/idGenerator';
import { BrandAttributes } from '@/domain/models/brand/brand';
import BrandModel from '@/infra/db/model/brand/brandModel';
import { NotFoundError } from '@/shared/errors/notFoundError';

type SutTypes = {
    sut: BrandRepository;
    idGeneratorStub: IIdGenerator;
};

jest.mock('@/infra/db/model/brand/brandModel', () => ({
    async create(data: BrandAttributes): Promise<BrandAttributes> {
        return data;
    },

    async findByPk(): Promise<any> {
        return {
            id: 'valid uuid',
            description: 'valid description',

            update: (data: any) => {
                return {
                    id: 'valid uuid',
                    ...data
                };
            },

            destroy: () => {}
        };
    }
}));

const makeIdGenerator = (): IIdGenerator => {
    class IdGeneratorStub implements IIdGenerator {
        async generate(): Promise<string> {
            return 'valid uuid';
        }
    }

    return new IdGeneratorStub();
};

const makeSut = (): SutTypes => {
    const idGeneratorStub = makeIdGenerator();
    const sut = new BrandRepository(idGeneratorStub);

    return { sut, idGeneratorStub };
};

describe('Brand Repository', () => {
    describe('Add', () => {
        test('should call IdGenerator', async () => {
            const { sut, idGeneratorStub } = makeSut();
            const idGeneratorStubSpy = jest.spyOn(idGeneratorStub, 'generate');

            await sut.add({
                description: 'valid description'
            });

            expect(idGeneratorStubSpy).toHaveBeenCalled();
        });

        test('should throw if IdGenerator throws', async () => {
            const { sut, idGeneratorStub } = makeSut();

            jest.spyOn(idGeneratorStub, 'generate').mockImplementation(() => {
                throw new Error('Test throw');
            });

            const addPromise = sut.add({
                description: 'valid description'
            });

            await expect(addPromise).rejects.toThrow();
        });

        test('should return valid user attributes', async () => {
            const { sut } = makeSut();

            const userAttr = await sut.add({
                description: 'valid description'
            });

            expect(userAttr).toEqual({
                id: 'valid uuid',
                description: 'valid description'
            });
        });
    });

    describe('Find by id', () => {
        test('should find brand by id and return', async () => {
            const { sut } = makeSut();

            const brand = await sut.findById('valid id');
            expect(brand).toBeTruthy();
            expect(brand?.id).toEqual('valid uuid');
        });
    });

    describe('Update', () => {
        test('should update brand by id and return', async () => {
            const { sut } = makeSut();

            const brand = await sut.update('valid id', { description: 'new valid' });

            expect(brand).toBeTruthy();
            expect(brand?.id).toEqual('valid uuid');
            expect(brand?.description).toEqual('new valid');
        });

        test('should throw if no brand was found when updating by id', async () => {
            const { sut } = makeSut();
            jest.spyOn(BrandModel, 'findByPk').mockReturnValueOnce(null);

            const updatePromise = sut.update('invalid id', { description: 'new valid' });
            await expect(updatePromise).rejects.toThrow(new NotFoundError('Data not found'));
        });
    });

    describe('Delete', () => {
        test('should delete brand by id', async () => {
            const { sut } = makeSut();

            const deletePromise = sut.delete('valid id');

            await expect(deletePromise).resolves.not.toThrow();
        });

        test('should throw if no brand was found when deleting by id', async () => {
            const { sut } = makeSut();
            jest.spyOn(BrandModel, 'findByPk').mockReturnValueOnce(null);

            const deletePromise = sut.delete('invalid id');
            await expect(deletePromise).rejects.toThrow(new NotFoundError('Data not found'));
        });
    });
});
