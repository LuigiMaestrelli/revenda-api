import { getMockReq, getMockRes } from '@jest-mock/express';
import { convertRequest, setHeaders } from '@/infra/adapters/express/expressRouteAdapter';
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
});
