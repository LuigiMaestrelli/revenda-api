import { BaseError } from './baseError';

export class InvalidParamError extends BaseError {
    constructor(message: string) {
        super(`Invalid param: ${message}`);
        this.name = 'InvalidParamError';
    }
}
