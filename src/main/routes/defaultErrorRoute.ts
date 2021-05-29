import { Express } from 'express';
import { makeErrorResponse } from '@/shared/utils/http';
import { setResponseData } from '@/infra/adapters/express/expressRouteAdapter';

export const defaultErrorRoute = (app: Express): void => {
    app.use((err: any, req: any, res: any, next: any) => {
        const response = makeErrorResponse(err);
        setResponseData(response, res);
        next();
    });
};
