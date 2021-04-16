import { Request, Response, RequestHandler } from 'express';
import { Controller, HttpRequest } from '@/presentation/interfaces';

export const adaptRoute = (controller: Controller): RequestHandler => {
    return async (req: Request, res: Response) => {
        const httpResquest: HttpRequest = {
            body: req.body,
            query: req.query
        };

        const response = await controller.handle(httpResquest);

        if (response.header) {
            for (const headerName in response.header) {
                res.header(headerName, response.header[headerName]);
            }
        }

        res.status(response.statusCode).json(response.body);
    };
};
