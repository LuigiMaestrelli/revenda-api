import { InvalidParamError, MissingParamError, ServerError, UnauthorizedError } from '@/shared/errors';
import { HttpResponse, HttpResponseError } from '../../presentation/interfaces';

export function makeBadRequestResponse(error: Error): HttpResponseError {
    return {
        statusCode: 400,
        body: {
            message: error.message
        }
    };
}

export function makeUnauthorizedResponse(error: Error): HttpResponseError {
    return {
        statusCode: 401,
        body: {
            message: error.message
        }
    };
}

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

export function makeSuccessResponse(body?: any, headers?: any): HttpResponse {
    return {
        statusCode: 200,
        body,
        headers
    };
}

export function makeErrorResponse(error: Error): HttpResponseError {
    if (error instanceof InvalidParamError) {
        return makeBadRequestResponse(error);
    }

    if (error instanceof MissingParamError) {
        return makeBadRequestResponse(error);
    }

    if (error instanceof UnauthorizedError) {
        return makeUnauthorizedResponse(error);
    }

    return makeServerErrorResponse(error);
}
