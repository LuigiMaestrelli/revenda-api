export type HttpResponse = {
    statusCode: number;
    body?: any;
};

export type HttpRequest = {
    body?: any;
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
