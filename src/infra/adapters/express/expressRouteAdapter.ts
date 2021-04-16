import { Request, Response } from 'express';
import { RequestHandler } from 'express-serve-static-core';
import { Controller, HttpRequest } from '@/presentation/interfaces';

export const adaptRoute = (controller: Controller): RequestHandler => {
    return async (req: Request, res: Response) => {
        const httpResquest: HttpRequest = {
            body: req.body
        };

        const response = await controller.handle(httpResquest);
        res.status(response.statusCode).json(response.body);
    };
};
