import { HttpRequest } from './http';

export interface IValidation {
    validate: (httpRequest: HttpRequest) => Promise<void>;
}
