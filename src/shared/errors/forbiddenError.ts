import { BaseError } from './baseError';

export class ForbiddenError extends BaseError {
    constructor(message: string) {
        super(`Forbidden: ${message}`);
        this.name = 'ForbiddenError';
    }
}
