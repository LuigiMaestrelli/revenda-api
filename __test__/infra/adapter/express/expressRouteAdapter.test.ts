import { RequestHandler } from 'express';
import request from 'supertest';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { makeBadRequestResponse, makeServerErrorResponse, makeSuccessResponse } from '@/shared/utils/http';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/interfaces';
import app from '@/main/config/app';
import { ServerError } from '@/shared/errors';

type SutTypes = {
    controller: Controller;
    sut: RequestHandler;
};

class TestControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return makeSuccessResponse(
            {
                test: true
            },
            {
                myHeader: 'some data'
            }
        );
    }
}

const makeSut = (): SutTypes => {
    const controller = new TestControllerStub();
    const sut = adaptRoute(controller);

    return { sut, controller };
};

describe('Express Route Adapter', () => {
    test('should call controller with correct body values', async () => {
        const { sut, controller } = makeSut();
        app.post('/testRouteAdapter', sut);

        const controllerSpy = jest.spyOn(controller, 'handle');

        await request(app).post('/testRouteAdapter').send({
            data: true
        });

        expect(controllerSpy).toBeCalledWith({
            body: {
                data: true
            },
            query: {}
        });
    });

    test('should call controller with correct query values', async () => {
        const { sut, controller } = makeSut();
        app.get('/testRouteAdapter', sut);

        const controllerSpy = jest.spyOn(controller, 'handle');

        await request(app).get('/testRouteAdapter?a=1&b=2&c=qweasd').send();

        expect(controllerSpy).toBeCalledWith({
            body: {},
            query: {
                a: '1',
                b: '2',
                c: 'qweasd'
            }
        });
    });

    test('should return correct success status code', async () => {
        const { sut } = makeSut();
        app.get('/testRouteAdapterSuccess', sut);

        const response = await request(app).get('/testRouteAdapterSuccess').send();
        expect(response.status).toBe(200);
    });

    test('should return correct server error status code', async () => {
        const { sut, controller } = makeSut();
        app.get('/testRouteAdapterServerError', sut);

        jest.spyOn(controller, 'handle').mockImplementationOnce(async () => {
            return await new Promise(resolve => {
                resolve(makeServerErrorResponse(new ServerError('teste')));
            });
        });

        const response = await request(app).get('/testRouteAdapterServerError').send();
        expect(response.status).toBe(500);
    });

    test('should return correct bad request status code', async () => {
        const { sut, controller } = makeSut();
        app.get('/testRouteAdapterBaseRequest', sut);

        jest.spyOn(controller, 'handle').mockImplementationOnce(async () => {
            return await new Promise(resolve => {
                resolve(makeBadRequestResponse(new Error('teste')));
            });
        });

        const response = await request(app).get('/testRouteAdapterBaseRequest').send();
        expect(response.status).toBe(400);
    });

    test('should return correct headers', async () => {
        const { sut, controller } = makeSut();
        app.get('/testRouteAdapterHeader', sut);

        jest.spyOn(controller, 'handle').mockImplementationOnce(async () => {
            return await new Promise(resolve => {
                const response = makeSuccessResponse(null, {
                    someHeader: 10,
                    otherheader: 'test'
                });
                resolve(response);
            });
        });

        const response = await request(app).get('/testRouteAdapterHeader').send();
        expect(response.header.someheader).toBe('10');
        expect(response.header.otherheader).toBe('test');
    });
});
