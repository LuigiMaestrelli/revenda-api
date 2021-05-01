import { BaseError } from './baseError';

export class UnauthorizedError extends BaseError {
    constructor(message: string) {
        super(`Unauthorized: ${message}`);
        this.name = 'UnauthorizedError';
    }
}
