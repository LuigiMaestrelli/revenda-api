import { Request, Response, RequestHandler } from 'express';
import { Controller, HttpRequest } from '@/presentation/interfaces';

export const adaptRoute = (controller: Controller): RequestHandler => {
    return async (req: Request, res: Response) => {
        const httpResquest: HttpRequest = {
            body: req.body,
            query: req.query
        };

        const response = await controller.handle(httpResquest);

        for (const headerName in response.headers || {}) {
            res.header(headerName, response.headers[headerName]);
        }

        res.status(response.statusCode).json(response.body);
    };
};
