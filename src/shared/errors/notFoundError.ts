import { BaseError } from './baseError';

export class NotFoundError extends BaseError {
    constructor(message: string) {
        super(`Not found: ${message}`);
        this.name = 'NotFoundError';
    }
}
