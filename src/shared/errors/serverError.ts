import { BaseError } from './baseError';

export class ServerError extends BaseError {
    constructor(message: string, error?: Error) {
        super(message);
        this.name = 'ServerError';
        this.parentError = error;
    }
}
