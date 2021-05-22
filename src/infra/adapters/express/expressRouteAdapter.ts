import { Request, Response, RequestHandler } from 'express';
import { IController, HttpRequest, HttpResponse } from '@/presentation/protocols';

export const convertRequest = (req: Request): HttpRequest => {
    return {
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
};

export const setHeaders = (httpResponse: HttpResponse, res: Response): void => {
    const headers = httpResponse.headers ?? {};
    for (const headerName in headers) {
        res.setHeader(headerName, headers[headerName]);
    }

    return headers;
};

export const adaptRoute = (controller: IController): RequestHandler => {
    return async (req: Request, res: Response) => {
        const httpResquest = convertRequest(req);

        const response = await controller.handle(httpResquest);

        setHeaders(response, res);

        res.status(response.statusCode).json(response.body);
    };
};
