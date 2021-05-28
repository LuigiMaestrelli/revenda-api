import { RequestHandler } from 'express';
import request from 'supertest';
import { adaptRoute } from '@/infra/adapters/express/expressRouteAdapter';
import { makeBadRequestResponse, makeServerErrorResponse, makeSuccessResponse } from '@/shared/utils/http';
import { IController } from '@/presentation/protocols';
import { HttpRequest, HttpResponse } from '@/domain/models/infra/http';
import app from '@/main/config/app';
import { ServerError } from '@/shared/errors';

type SutTypes = {
    controllerStub: IController;
    sut: RequestHandler;
};

class TestControllerStub implements IController {
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
    const controllerStub = new TestControllerStub();
    const sut = adaptRoute(controllerStub);

    return { sut, controllerStub };
};

describe('Express Route Adapter', () => {
    test('should call controller with correct body values', async () => {
        const { sut, controllerStub } = makeSut();
        app.post('/testRouteAdapter', sut);

        const controllerSpy = jest.spyOn(controllerStub, 'handle');

        await request(app).post('/testRouteAdapter').send({
            data: true
        });

        expect(controllerSpy).toBeCalledWith({
            auth: undefined,
            body: {
                data: true
            },
            query: {},
            params: {},
            networkAccess: {
                hostName: '127.0.0.1',
                ip: '::ffff:127.0.0.1',
                origin: undefined,
                userAgent: undefined
            }
        });
    });

    test('should call controller with correct query values', async () => {
        const { sut, controllerStub } = makeSut();
        app.get('/testRouteAdapter', sut);

        const controllerSpy = jest.spyOn(controllerStub, 'handle');

        await request(app).get('/testRouteAdapter?a=1&b=2&c=qweasd').send();

        expect(controllerSpy).toBeCalledWith({
            auth: undefined,
            body: {},
            params: {},
            query: {
                a: '1',
                b: '2',
                c: 'qweasd'
            },
            networkAccess: {
                hostName: '127.0.0.1',
                ip: '::ffff:127.0.0.1',
                origin: undefined,
                userAgent: undefined
            }
        });
    });

    test('should call controller with correct param values', async () => {
        const { sut, controllerStub } = makeSut();
        app.get('/testRouteAdapter/:id', sut);

        const controllerSpy = jest.spyOn(controllerStub, 'handle');

        await request(app).get('/testRouteAdapter/valid-id').send();

        expect(controllerSpy).toBeCalledWith({
            auth: undefined,
            body: {},
            params: {
                id: 'valid-id'
            },
            query: {},
            networkAccess: {
                hostName: '127.0.0.1',
                ip: '::ffff:127.0.0.1',
                origin: undefined,
                userAgent: undefined
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
        const { sut, controllerStub } = makeSut();
        app.get('/testRouteAdapterServerError', sut);

        jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
            return await new Promise(resolve => {
                resolve(makeServerErrorResponse(new ServerError('teste')));
            });
        });

        const response = await request(app).get('/testRouteAdapterServerError').send();
        expect(response.status).toBe(500);
    });

    test('should return correct bad request status code', async () => {
        const { sut, controllerStub } = makeSut();
        app.get('/testRouteAdapterBaseRequest', sut);

        jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
            return await new Promise(resolve => {
                resolve(makeBadRequestResponse(new Error('teste')));
            });
        });

        const response = await request(app).get('/testRouteAdapterBaseRequest').send();
        expect(response.status).toBe(400);
    });

    test('should return correct headers', async () => {
        const { sut, controllerStub } = makeSut();
        app.get('/testRouteAdapterHeader', sut);

        jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
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

    test('should return json as a default contentType', async () => {
        const { sut, controllerStub } = makeSut();
        app.get('/testRouteAdapterDefaultContent', sut);

        jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
            return await new Promise(resolve => {
                const response = makeSuccessResponse();
                resolve(response);
            });
        });

        const response = await request(app).get('/testRouteAdapterDefaultContent').send();
        expect(response.header['content-type']).toContain('application/json');
    });

    test('should return defined contentType', async () => {
        const { sut, controllerStub } = makeSut();
        app.get('/testRouteAdapterDefinedContent', sut);

        jest.spyOn(controllerStub, 'handle').mockImplementationOnce(async () => {
            return await new Promise(resolve => {
                const response = makeSuccessResponse(null, null, 'image/png');
                resolve(response);
            });
        });

        const response = await request(app).get('/testRouteAdapterDefinedContent').send();
        expect(response.header['content-type']).toContain('image/png');
    });
});
