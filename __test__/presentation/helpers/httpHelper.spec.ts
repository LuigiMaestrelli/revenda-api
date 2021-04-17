import {
    makeSuccessResponse,
    makeBadRequestResponse,
    makeServerErrorResponse
} from '@/presentation/helpers/httpHelper';
import { ServerError } from '@/shared/errors';

describe('Http Helper', () => {
    test('should return statusCode 200 on success response', () => {
        const response = makeSuccessResponse();
        expect(response.statusCode).toBe(200);
    });

    test('should return the body on success response', () => {
        const response = makeSuccessResponse({ test: true });
        expect(response.body).toEqual({ test: true });
    });

    test('should return the headers on success response', () => {
        const response = makeSuccessResponse(null, { someheader: 10 });
        expect(response.headers).toEqual({ someheader: 10 });
    });

    test('should return statusCode 400 on bad response', () => {
        const response = makeBadRequestResponse(new Error());
        expect(response.statusCode).toBe(400);
    });

    test('should return the message on bad response', () => {
        const response = makeBadRequestResponse(new Error('The message'));
        expect(response.body.message).toBe('The message');
    });

    test('should return statusCode 500 on server error', () => {
        const response = makeServerErrorResponse(new ServerError('Message'));
        expect(response.statusCode).toBe(500);
    });

    test('should return the correct message on server error', () => {
        const response = makeServerErrorResponse(new ServerError('Message'));
        expect(response.body.message).toBe('Message');
    });

    test('should return the correct detailed message on server error', () => {
        const response = makeServerErrorResponse(new ServerError('Message', new Error('The inner message')));
        expect(response.body.message).toBe('Message');
        expect(response.body.parentMessage).toBe('The inner message');
    });
});
