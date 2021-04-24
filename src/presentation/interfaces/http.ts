import { TokenPayload } from '@/domain/models/auth/authentication';

export type HttpRequest = {
    body?: any;
    query?: any;
    auth?: TokenPayload;
};

export type HttpResponse = {
    statusCode: number;
    body?: any;
    headers?: any;
};

export type HttpResponseError = {
    statusCode: number;
    body: HttpRequestError;
};

export type HttpRequestError = {
    message: string;
    parentMessage?: string;
    details?: string;
};
