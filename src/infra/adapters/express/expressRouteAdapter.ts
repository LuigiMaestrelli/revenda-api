import { Request, Response, RequestHandler } from 'express';
import { IController, HttpRequest } from '@/presentation/protocols';

export const adaptRoute = (controller: IController): RequestHandler => {
    return async (req: Request, res: Response) => {
        const httpResquest: HttpRequest = {
            body: req.body,
            query: req.query,
            params: req.params,
            /* @ts-expect-error */
            auth: req.auth
        };

        const response = await controller.handle(httpResquest);
        const headers = response.headers ?? {};
        for (const headerName in headers) {
            res.header(headerName, headers[headerName]);
        }

        res.status(response.statusCode).json(response.body);
    };
};
