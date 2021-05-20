import { TokenPayload } from '@/domain/models/auth/authentication';
import { NetworkAccessInfo } from '@/domain/models/auth/networkAccessInfo';

export type HttpRequest = {
    body?: any;
    params?: any;
    query?: any;
    auth?: TokenPayload;
    networkAccess?: NetworkAccessInfo;
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
