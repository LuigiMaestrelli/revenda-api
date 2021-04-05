import { ServerError } from '@/shared/errors';
import { HttpResponse, HttpResponseError } from '../interfaces';

export function makeBadRequestResponse(error: Error): HttpResponseError {
    return {
        statusCode: 400,
        body: {
            message: error.message
        }
    };
}
/*
export function makeForbiddenResponse(error: Error): HttpResponseError {
    return {
        statusCode: 403,
        body: {
            message: error?.message || 'Forbidden'
        }
    };
}

export function makeUnauthorizedResponse(error?: Error): HttpResponseError {
    return {
        statusCode: 401,
        body: {
            message: error?.message || 'Unauthorized'
        }
    };
}
*/
export function makeServerErrorResponse(error: ServerError): HttpResponseError {
    return {
        statusCode: 500,
        body: {
            message: error.message,
            parentMessage: error.parentError?.message,
            details: error.parentError?.stack
        }
    };
}

export function makeSuccessResponse(body?: any): HttpResponse {
    return {
        statusCode: 200,
        body
    };
}
