import { getMockReq, getMockRes } from '@jest-mock/express';
import { convertRequest, setHeaders, setResponseData } from '@/infra/adapters/express/expressRouteAdapter';
import { HttpRequest, HttpResponse } from '@/presentation/protocols';

const DEFAULT_REQUEST: HttpRequest = {
    body: {},
    query: {},
    params: {},
    auth: undefined,
    networkAccess: {
        ip: '',
        hostName: '',
        origin: undefined,
        userAgent: undefined
    }
};

describe('Express Route Adapter', () => {
    describe('convertRequest', () => {
        test('should convert Express body request to HttpRequest', async () => {
            const request = getMockReq({
                body: {
                    teste: 1
                }
            });
            const result = convertRequest(request);

            expect(result).toEqual({
                ...DEFAULT_REQUEST,
                body: {
                    teste: 1
                }
            });
        });

        test('should convert Express query request to HttpRequest', async () => {
            const request = getMockReq({
                query: {
                    id: '123'
                }
            });
            const result = convertRequest(request);

            expect(result).toEqual({
                ...DEFAULT_REQUEST,
                query: {
                    id: '123'
                }
            });
        });

        test('should convert Express params request to HttpRequest', async () => {
            const request = getMockReq({
                params: {
                    id: '123'
                }
            });
            const result = convertRequest(request);

            expect(result).toEqual({
                ...DEFAULT_REQUEST,
                params: {
                    id: '123'
                }
            });
        });

        test('should convert Express networkAccess request to HttpRequest', async () => {
            const request = getMockReq({
                ip: 'valid ip',
                hostname: 'valid hostname',
                headers: {
                    origin: 'valid origin',
                    'user-agent': 'valid user agent'
                }
            });
            const result = convertRequest(request);

            expect(result).toEqual({
                ...DEFAULT_REQUEST,
                networkAccess: {
                    ip: 'valid ip',
                    hostName: 'valid hostname',
                    origin: 'valid origin',
                    userAgent: 'valid user agent'
                }
            });
        });

        test('should convert File data', async () => {
            const request = getMockReq({
                file: {
                    someData: 'teste',
                    buffer: null
                }
            });
            const result = convertRequest(request);

            expect(result).toEqual({
                ...DEFAULT_REQUEST,
                file: {
                    someData: 'teste',
                    buffer: null
                }
            });
        });
    });

    describe('setHeaders', () => {
        test('should convert Headers to Express', async () => {
            const { res } = getMockRes();
            const response: HttpResponse = {
                headers: {
                    test: 1,
                    test2: 2,
                    test3: 3
                },
                statusCode: 200
            };

            const headers = setHeaders(response, res);

            expect(headers).toEqual({
                test: 1,
                test2: 2,
                test3: 3
            });
        });

        test('should convert Headers to Express if no header is sent', async () => {
            const { res } = getMockRes();
            const response: HttpResponse = {
                headers: null,
                statusCode: 200
            };

            const headers = setHeaders(response, res);

            expect(headers).toEqual({});
        });
    });

    describe('setResponseData', () => {
        test('should return a json as default contentType', () => {
            const { res } = getMockRes();

            const jsonSpy = jest.spyOn(res, 'json');

            const response: HttpResponse = {
                body: {
                    test: 1
                },
                statusCode: 200
            };

            setResponseData(response, res);

            expect(jsonSpy).toHaveBeenCalledWith({
                test: 1
            });
        });

        test('should return setted contentType', () => {
            const { res } = getMockRes();

            const contentTypeSpy = jest.spyOn(res, 'contentType');
            const jsonSpy = jest.spyOn(res, 'json');

            const response: HttpResponse = {
                body: {
                    test: 1
                },
                contentType: 'test',
                statusCode: 200
            };

            setResponseData(response, res);

            expect(contentTypeSpy).toHaveBeenCalledWith('test');
            expect(jsonSpy).not.toHaveBeenCalled();
        });

        test('should call status with correct value', () => {
            const { res } = getMockRes();

            const statusSpy = jest.spyOn(res, 'status');

            const response: HttpResponse = {
                body: {
                    test: 1
                },
                contentType: 'test',
                statusCode: 501
            };

            setResponseData(response, res);

            expect(statusSpy).toHaveBeenCalledWith(501);
        });
    });
});
