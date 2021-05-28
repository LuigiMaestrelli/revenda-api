import { Request, Response, RequestHandler } from 'express';
import { IController } from '@/presentation/protocols';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';

export const convertRequest = (req: Request): HttpRequest => {
    const httpRequest: HttpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        /* @ts-expect-error */
        auth: req.auth,
        networkAccess: {
            ip: req.ip,
            hostName: req.hostname,
            origin: req.headers.origin,
            userAgent: req.headers['user-agent']
        }
    };

    if (req.file) {
        httpRequest.file = {
            ...req.file
        };
    }

    return httpRequest;
};

export const setHeaders = (httpResponse: HttpResponse, res: Response): void => {
    const headers = httpResponse.headers ?? {};
    for (const headerName in headers) {
        res.setHeader(headerName, headers[headerName]);
    }

    return headers;
};

export const setResponseData = (httpResponse: HttpResponse, res: Response): void => {
    res.status(httpResponse.statusCode);

    if (httpResponse.contentType) {
        res.contentType(httpResponse.contentType);
        res.send(httpResponse.body);
        return;
    }

    res.json(httpResponse.body);
};

export const adaptRoute = (controller: IController): RequestHandler => {
    return async (req: Request, res: Response) => {
        const httpResquest = convertRequest(req);

        const response = await controller.handle(httpResquest);

        setHeaders(response, res);
        setResponseData(response, res);
    };
};
