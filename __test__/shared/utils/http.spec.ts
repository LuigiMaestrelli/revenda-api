import {
    makeSuccessResponse,
    makeBadRequestResponse,
    makeServerErrorResponse,
    makeUnauthorizedResponse,
    makeErrorResponse,
    makeNotFoundResponse,
    makeForbiddenResponse
} from '@/shared/utils/http';
import { ForbiddenError, InvalidParamError, MissingParamError, ServerError, UnauthorizedError } from '@/shared/errors';
import { NotFoundError } from '@/shared/errors/notFoundError';

describe('Http Helper', () => {
    describe('Success response', () => {
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
    });

    describe('BadRequest response', () => {
        test('should return statusCode 400 on bad request', () => {
            const response = makeBadRequestResponse(new Error('The message'));
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('The message');
        });

        test('should return statusCode 400 on generic InvalidParamError with makeErrorResponse', () => {
            const response = makeErrorResponse(new InvalidParamError('Message'));
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Invalid param: Message');
        });

        test('should return statusCode 400 on generic MissingParamError with makeErrorResponse', () => {
            const response = makeErrorResponse(new MissingParamError('Message'));
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toBe('Missing param: Message');
        });
    });

    describe('Unauthorized response', () => {
        test('should return statusCode 401 on unauthorized response', () => {
            const response = makeUnauthorizedResponse(new Error('Message'));
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Message');
        });

        test('should return statusCode 401 on generic UnauthorizedError with makeErrorResponse', () => {
            const response = makeErrorResponse(new UnauthorizedError('Message'));
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toBe('Unauthorized: Message');
        });
    });

    describe('Forbidden response', () => {
        test('should return statusCode 403 on forbidden response', () => {
            const response = makeForbiddenResponse(new Error('Message'));
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Message');
        });

        test('should return statusCode 403 on generic ForbiddenError with makeErrorResponse', () => {
            const response = makeErrorResponse(new ForbiddenError('Message'));
            expect(response.statusCode).toBe(403);
            expect(response.body.message).toBe('Forbidden: Message');
        });
    });

    describe('NotFound response', () => {
        test('should return statusCode 404 on not found', () => {
            const response = makeNotFoundResponse(new Error('The message'));
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('The message');
        });

        test('should return statusCode 404 on generic NotFoundError with makeErrorResponse', () => {
            const response = makeErrorResponse(new NotFoundError('Message'));
            expect(response.statusCode).toBe(404);
            expect(response.body.message).toBe('Not found: Message');
        });
    });

    describe('ServerError response', () => {
        test('should return statusCode 500 on server error', () => {
            const response = makeServerErrorResponse(new ServerError('Message'));
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Message');
            expect(response.body.details).toBeTruthy();
        });

        test('should return the correct detailed message on server error', () => {
            const response = makeServerErrorResponse(new ServerError('Message', new Error('The inner message')));
            expect(response.body.message).toBe('Message');
            expect(response.body.parentMessage).toBe('The inner message');
            expect(response.body.details).toBeTruthy();
        });

        test('should return statusCode 500 on generic Error with makeErrorResponse', () => {
            const response = makeErrorResponse(new Error('Message'));
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Message');
        });

        test('should return statusCode 500 on ServerError with makeErrorResponse', () => {
            const response = makeErrorResponse(new ServerError('Message', new Error('Test error')));
            expect(response.statusCode).toBe(500);
            expect(response.body.message).toBe('Message');
        });
    });
});
