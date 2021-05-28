import { HttpRequest } from '@/domain/models/infra/http';

export interface IValidation {
    validate: (httpRequest: HttpRequest) => Promise<void>;
}
