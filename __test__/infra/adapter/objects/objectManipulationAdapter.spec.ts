import { IObjectManipulation } from '@/infra/protocols/objectManipulation';
import { ObjectManipulation } from '@/infra/adapters/objects/objectManipulationAdapter';

const makeSut = (): IObjectManipulation => {
    return new ObjectManipulation();
};

describe('ObjectManipulation Adapter', () => {
    test('should remove props not contained in allowed props', () => {
        const sut = makeSut();

        const originalObj = {
            prop1: 1,
            prop2: 'test',
            prop3: 23.2
        };

        const resultObs = sut.filterAllowedProps(originalObj, ['prop1']);
        expect(resultObs).toEqual({
            prop1: 1
        });
    });

    test('should filter multiple props', () => {
        const sut = makeSut();

        const originalObj = {
            prop1: 1,
            prop2: 'test',
            prop3: 23.2
        };

        const resultObs = sut.filterAllowedProps(originalObj, ['prop1', 'prop2']);
        expect(resultObs).toEqual({
            prop1: 1,
            prop2: 'test'
        });
    });
});
