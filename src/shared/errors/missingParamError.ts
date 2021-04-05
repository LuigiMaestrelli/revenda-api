import { BaseError } from './baseError';

export class MissingParamError extends BaseError {
    constructor(message: string) {
        super(`Missing param: ${message}`);
        this.name = 'MissingParamError';
    }
}
