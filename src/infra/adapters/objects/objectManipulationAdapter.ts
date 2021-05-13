import { IObjectManipulation } from '@/infra/protocols/objectManipulation';

export class ObjectManipulation implements IObjectManipulation {
    filterAllowedProps(object: any, allowedProps: string[]): any {
        const newObject: any = {};
        Object.keys(object).forEach(key => {
            if (allowedProps.includes(key)) {
                newObject[key] = object[key];
            }
        });

        return newObject;
    }
}
